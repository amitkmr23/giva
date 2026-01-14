💬 Real-Time Chat Application (1-to-1)

A full-stack real-time chat application built using MERN + Socket.IO that supports private messaging between two users with features like unread message count, read receipts (✓✓), typing indicator, and online status.

This project was implemented as part of an assignment focusing on message read status, state management, and backend API design.

🚀 Features
✅ Core Features

1-to-1 private chat

Real-time messaging using Socket.IO

Message persistence using MongoDB

Online / Offline user status

Typing indicator (“Typing…”)

Read receipts (✓ delivered / ✓✓ seen)

Unread message count per conversation

Optimized API & state management

✅ Message Read Logic

Messages are unread by default

When a user opens a chat:

All messages from that user are marked as read

Sender receives real-time ✓✓ update

Unread count updates instantly

🧱 Tech Stack
Frontend

React (Vite)

Zustand (state management)

Tailwind CSS

Axios

Socket.IO Client

Backend

Node.js

Express.js

MongoDB (Mongoose)

Socket.IO

JWT Authentication

Cloudinary (image uploads)

🗄️ Database Schema
Message Model (Message.js)
{
  senderId: ObjectId (User),
  receiverId: ObjectId (User),
  text: String,
  image: String,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}

Read Status Logic

isRead = false → unread

isRead = true → read

Marked read when receiver opens the chat

▶️ Setup Instructions
1️⃣ Clone Repository
git clone <repo-url>
cd chat-app

2️⃣ Backend Setup
cd backend
npm install


Create .env:

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173


Run backend:

npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🧪 How to Test

Open two browsers / incognito windows

Login with two different users

Send messages:

✓ appears when delivered

✓✓ appears when read

Unread count increases when chat is unopened

Typing indicator shows in real-time
