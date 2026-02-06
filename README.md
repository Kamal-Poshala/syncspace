# SyncSpace — Real-Time Collaborative Workspace

SyncSpace is a real-time collaborative text workspace built using **React, Node.js, Socket.IO, and MongoDB**.  
It enables multiple users to edit shared content simultaneously with live presence tracking and persistent storage.

---

## 🚀 Features

- 🔐 JWT-based authentication (REST + WebSockets)
- ⚡ Real-time collaboration using Socket.IO
- 👥 Live user presence tracking
- 💾 Persistent workspace storage with MongoDB
- 🧠 Optimized performance using debouncing & throttling
- 🧩 Clean, modular React component architecture

---

## 🏗️ System Architecture

Client (React)
├── Auth (JWT)
├── Editor (Debounced input)
├── Presence UI
│
│ WebSocket (Socket.IO)
▼
Server (Node.js + Express)
├── REST Auth API
├── Socket Authentication Middleware
├── Workspace Event Handlers
│ ├── Join / Leave
│ ├── Real-time Updates
│ └── Throttled DB Writes
▼
MongoDB
├── Users
└── Workspaces


---

## 🛠️ Tech Stack

### Frontend
- React (TypeScript)
- Socket.IO Client
- Modular component design
- Debounced real-time updates

### Backend
- Node.js + Express
- Socket.IO
- JWT Authentication
- Mongoose (MongoDB ORM)

### Database
- MongoDB (local or Atlas)

---

## ⚙️ Performance Optimizations

- **Client-side debouncing** to reduce socket event spam
- **Server-side throttling** to protect database writes
- Immediate broadcasts for smooth real-time UX

---

## 📁 Project Structure

syncspace/
├── client/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Auth.tsx
│ │ │ ├── Layout.tsx
│ │ │ ├── UserPresence.tsx
│ │ │ └── Editor.tsx
│ │ ├── lib/
│ │ │ ├── socket.ts
│ │ │ └── debounce.ts
│ │ └── App.tsx
│ └── package.json
│
├── server/
│ ├── src/
│ │ ├── config/db.js
│ │ ├── middleware/socketAuth.js
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ └── Workspace.js
│ │ ├── routes/auth.routes.js
│ │ ├── sockets/workspace.js
│ │ ├── app.js
│ │ └── index.js
│ └── package.json
│
└── README.md

---

## ▶️ Running the Project Locally

### 1️⃣ Start MongoDB
```bash
mongod
