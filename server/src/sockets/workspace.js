const Workspace = require("../models/Workspace");

// Throttle locks per workspaceId
const updateLocks = new Map();

function registerWorkspaceHandlers(io, socket) {
  // JOIN WORKSPACE
  socket.on("workspace:join", async ({ workspaceId }) => {
    if (!workspaceId) return;

    socket.join(workspaceId);

    let workspace = await Workspace.findOne({ workspaceId });

    if (!workspace) {
      workspace = await Workspace.create({
        workspaceId,
        content: "",
        users: [],
      });
    }

    const user = {
      userId: socket.user.userId,
      username: socket.user.username,
    };

    if (!workspace.users.find((u) => u.userId === user.userId)) {
      workspace.users.push(user);
      await workspace.save();
    }

    // Send full state to new user
    socket.emit("workspace:state", {
      content: workspace.content,
      users: workspace.users,
    });

    // Notify others
    socket.to(workspaceId).emit("user:joined", user);

    console.log(
      `User ${user.username} joined workspace ${workspaceId}`
    );
  });

  // UPDATE WORKSPACE CONTENT (THROTTLED)
  socket.on("workspace:update", async ({ workspaceId, content }) => {
    if (!workspaceId || typeof content !== "string") return;

    const workspace = await Workspace.findOne({ workspaceId });
    if (!workspace) return;

    // 🔹 Broadcast immediately for real-time UX
    socket.to(workspaceId).emit("workspace:update", { content });

    // 🔹 Throttle DB writes per workspace
    if (updateLocks.get(workspaceId)) return;

    updateLocks.set(workspaceId, true);

    setTimeout(async () => {
      try {
        workspace.content = content;
        await workspace.save();
      } catch (err) {
        console.error("DB update failed:", err);
      } finally {
        updateLocks.delete(workspaceId);
      }
    }, 300); // one DB write every 300ms max
  });

  // DISCONNECT CLEANUP
  socket.on("disconnect", async () => {
    const workspaces = await Workspace.find({
      "users.userId": socket.user.userId,
    });

    for (const workspace of workspaces) {
      workspace.users = workspace.users.filter(
        (u) => u.userId !== socket.user.userId
      );

      await workspace.save();

      socket.to(workspace.workspaceId).emit("user:left", {
        userId: socket.user.userId,
      });

      console.log(
        `User ${socket.user.username} left workspace ${workspace.workspaceId}`
      );
    }
  });
}

module.exports = registerWorkspaceHandlers;
