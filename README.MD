💬 Real-Time Chat Application (1-to-1)

A full-stack real-time chat application built using MERN + Socket.IO that supports private messaging between two users with features like unread message count, read receipts (✓✓), typing indicator, and online status.

This project was implemented as part of an assignment focusing on message read status, state management, and backend API design.

# 💬 Real-Time One-to-One Chat Application

This project is a real-time private chat application built using **Node.js**, **Express**, **MongoDB**, **React**, and **Socket.IO**.  
It supports **one-to-one messaging** with **read/unread message tracking**, **unread message counts**, **read receipts**, and **typing indicators**.

The focus of this project is **backend design**, **database modeling**, and **accurate handling of message read state**, as required in the assignment.

---

## 🚀 Features

### Core Messaging
- One-to-one private chat between users
- Text and image messages
- Messages stored persistently in MongoDB
- Real-time message delivery using Socket.IO

### Read / Unread Message System
- Messages are **unread by default**
- When a user opens a chat:
  - All incoming messages are marked as **read**
  - Read timestamp is stored
  - Sender is notified in real time
- Read receipts:
  - ✓ → Delivered
  - ✓✓ → Seen

### Unread Message Count
- Unread message count displayed for each conversation
- Count increases when messages arrive in inactive chats
- Count resets automatically when the chat is opened

### Real-Time Indicators
- Online / Offline user status
- Typing indicator (`Typing...`)
- Instant read receipt updates

---

## 🧠 Message Read Status Design

### Database Design (Message Model)

Each message stores its own read state:

- `senderId` – User who sent the message  
- `receiverId` – User who receives the message  
- `text` – Message content  
- `image` – Optional image  
- `isRead` – Boolean flag (default: `false`)  
- `seenAt` – Timestamp when message is read  

### Read Logic

- A message is considered **unread** when:
isRead = false
- When the receiver opens the chat:
- All messages from the sender are updated:
  ```
  isRead = true
  seenAt = current timestamp
  ```
- Unread count is calculated using:
receiverId = current user
AND isRead = false
This approach is simple, efficient, and ideal for one-to-one chat systems.

---

## 🔌 API Endpoints

### Messages

- `GET /api/messages/contacts`  
Fetch all chat contacts

- `GET /api/messages/:userId`  
Fetch messages with a specific user

- `POST /api/messages/send/:userId`  
Send a new message

- `PUT /api/messages/read/:userId`  
Mark messages as read

- `GET /api/messages/unread/counts`  
Get unread message count per chat

---

## 🔄 Real-Time Events (Socket.IO)

### Server Emits
- `newMessage` – New message received
- `messagesRead` – Messages marked as read
- `typing` – User is typing
- `stopTyping` – User stopped typing
- `getOnlineUsers` – Online users list

### Client Emits
- `typing`
- `stopTyping`

---

## 🧪 Application Flow

1. User sends a message
2. Message is saved with `isRead = false`
3. Receiver receives message via Socket.IO
4. If chat is open:
 - Message is marked as read immediately
5. If chat is closed:
 - Unread count increases
6. When chat is opened:
 - Messages are marked read
 - ✓✓ read receipt sent to sender in real time

---

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


🧠 Message Read Status Design
Message Schema (Simplified)

senderId

receiverId

text

image

isRead (Boolean)

seenAt (Timestamp)

Logic

A message is unread when isRead = false

On opening a chat:
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

```bash
 Clone Repository
git clone <repo-url>
```
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
