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



---

## 🧪 .env Setup

### Backend (`/backend`)

```bash
PORT=3000
MONGO_URI=your_mongo_uri_here

NODE_ENV=development

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
---
▶️ Setup Instructions
 Clone Repository
git clone <repo-url>
---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

🧪 How to Test

Open two browsers / incognito windows

Login with two different users

Send messages:

✓ appears when delivered

✓✓ appears when read

Unread count increases when chat is unopened

Typing indicator shows in real-time
