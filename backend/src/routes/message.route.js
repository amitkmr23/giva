
import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
  getUnreadCounts,
  markMessagesAsRead,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protectRoute);
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/unread-counts", getUnreadCounts);
router.put("/read/:id", markMessagesAsRead);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
