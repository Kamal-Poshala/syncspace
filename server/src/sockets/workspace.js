const Workspace = require("../models/Workspace");

const channelHandler = require("./channel");
const dmHandler = require("./dm");

module.exports = (io) => {
  // Helper to get all users in a room
  const getRoomUsers = (roomName) => {
    const room = io.sockets.adapter.rooms.get(roomName);
    if (!room) return [];

    const users = [];
    room.forEach((socketId) => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket && socket.user) {
        users.push({
          ...socket.user,
          socketId: socket.id
        });
      }
    });
    return users;
  };

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.user.username} (${socket.id})`);

    // Initialize Handlers
    channelHandler(io, socket);
    dmHandler(io, socket);

    // Join Workspace Room
    socket.on("workspace:join", async ({ slug }) => {
      if (!slug) return;

      try {
        // Validate membership
        const workspace = await Workspace.findOne({
          slug,
          "members.userId": socket.user.id
        });

        if (!workspace) {
          socket.emit("error", { message: "Access denied or workspace not found" });
          return;
        }

        const room = `workspace:${slug}`;

        // Check if already in room to avoid duplicate logic if re-joining
        if (socket.rooms.has(room)) return;

        socket.join(room);

        // Notify others
        socket.to(room).emit("user:joined", {
          user: socket.user,
          socketId: socket.id
        });

        // Send Snapshot to joiner
        socket.emit("workspace:connected", {
          slug,
          content: workspace.content,
          users: getRoomUsers(room),
        });

        console.log(`User ${socket.user.username} joined ${slug}`);
      } catch (err) {
        console.error("Join error:", err);
      }
    });

    // Leave Workspace
    socket.on("workspace:leave", ({ slug }) => {
      const room = `workspace:${slug}`;
      socket.leave(room);
      socket.to(room).emit("user:left", { socketId: socket.id });
    });

    // Content Update
    socket.on("workspace:update", async ({ slug, content }) => {
      const room = `workspace:${slug}`;
      // Verify room membership (basic check)
      if (!socket.rooms.has(room)) return;

      // Persist to DB (Throttled ideally, but direct for now)
      await Workspace.findOneAndUpdate({ slug }, { content });

      // Broadcast to others
      socket.to(room).emit("workspace:update", { content, updatedBy: socket.user.username });
    });

    // Typing Indicators
    socket.on("typing:start", ({ slug }) => {
      socket.to(`workspace:${slug}`).emit("typing:start", {
        username: socket.user.username,
        socketId: socket.id
      });
    });

    socket.on("typing:stop", ({ slug }) => {
      socket.to(`workspace:${slug}`).emit("typing:stop", {
        username: socket.user.username,
        socketId: socket.id
      });
    });

    // Handle Disconnect
    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((room) => {
        if (room.startsWith("workspace:")) {
          socket.to(room).emit("user:left", { socketId: socket.id });
        }
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.user.username}`);
    });
  });
};
