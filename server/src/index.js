const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const registerWorkspaceHandlers = require("./sockets/workspace");
const socketAuth = require("./middleware/socketAuth");

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Apply JWT socket authentication
io.use(socketAuth);

// Handle socket connections
io.on("connection", (socket) => {
  console.log(
    `User connected: ${socket.user.username} (${socket.id})`
  );

  registerWorkspaceHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log(
      `User disconnected: ${socket.user.username} (${socket.id})`
    );
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
