import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  const myId = req.user._id;
  const { id } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: id },
      { senderId: id, receiverId: myId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
};

export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const senderId = req.user._id;
  const { id: receiverId } = req.params;

  let imageUrl;
  if (image) {
    const upload = await cloudinary.uploader.upload(image);
    imageUrl = upload.secure_url;
  }

  const message = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", message);
  }

  res.status(201).json(message);
};

export const getUnreadCounts = async (req, res) => {
  const unread = await Message.aggregate([
    { $match: { receiverId: req.user._id, isRead: false } },
    { $group: { _id: "$senderId", count: { $sum: 1 } } },
  ]);

  const result = {};
  unread.forEach((u) => (result[u._id] = u.count));
  res.json(result);
};

export const markMessagesAsRead = async (req, res) => {
  const myId = req.user._id;
  const { id: senderId } = req.params;
  const seenAt = new Date();

  await Message.updateMany(
    { senderId, receiverId: myId, isRead: false },
    { $set: { isRead: true, seenAt } }
  );

  const senderSocketId = getReceiverSocketId(senderId);
  if (senderSocketId) {
    io.to(senderSocketId).emit("messagesRead", {
      readerId: myId,
      seenAt,
    });
  }

  res.json({ success: true });
};

export const getChatPartners = async (req, res) => {
  const userId = req.user._id;

  const chats = await Message.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$senderId", userId] },
            "$receiverId",
            "$senderId",
          ],
        },
        lastMessage: { $first: "$text" },
        lastTime: { $first: "$createdAt" },
      },
    },
  ]);

  const users = await User.find({ _id: { $in: chats.map((c) => c._id) } });

  res.json(
    users.map((u) => {
      const chat = chats.find(
        (c) => c._id.toString() === u._id.toString()
      );
      return {
        ...u.toObject(),
        lastMessage: chat?.lastMessage || "",
        lastTime: chat?.lastTime,
      };
    })
  );
};


