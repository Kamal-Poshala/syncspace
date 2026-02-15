const Message = require("../models/Message");
const Channel = require("../models/Channel");

module.exports = (io, socket) => {
    // Join Channel
    socket.on("channel:join", async ({ channelId }) => {
        if (!channelId) return;

        try {
            // Verify access (user in workspace) - simpler check if we trust channelId comes from valid workspace flow
            // But ideally we check if user is member of workspace for this channel
            const channel = await Channel.findById(channelId);
            if (!channel) {
                socket.emit("error", { message: "Channel not found" });
                return;
            }

            // Check if private and user is member
            if (channel.isPrivate && !channel.members.includes(socket.user.id)) {
                socket.emit("error", { message: "Access denied" });
                return;
            }

            const room = `channel:${channelId}`;
            socket.join(room);
            console.log(`User ${socket.user.username} joined channel ${channel.name}`);
        } catch (err) {
            console.error("Channel join error:", err);
        }
    });

    // Send Message
    socket.on("message:send", async ({ channelId, content, workspaceId }) => {
        if (!content || !channelId) return;

        try {
            const message = new Message({
                content,
                sender: socket.user.id,
                channelId,
                workspaceId
            });
            await message.save();

            // Populate sender for realtime display
            await message.populate("sender", "username avatar");

            // Broadcast to channel
            io.to(`channel:${channelId}`).emit("message:receive", message);
        } catch (err) {
            console.error("Message send error:", err);
        }
    });

    // Typing
    socket.on("channel:typing:start", ({ channelId }) => {
        socket.to(`channel:${channelId}`).emit("channel:typing:start", {
            username: socket.user.username,
            channelId
        });
    });

    socket.on("channel:typing:stop", ({ channelId }) => {
        socket.to(`channel:${channelId}`).emit("channel:typing:stop", {
            username: socket.user.username,
            channelId
        });
    });
};
