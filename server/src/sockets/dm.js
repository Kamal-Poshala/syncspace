const Message = require("../models/Message");
const DM = require("../models/DM");

module.exports = (io, socket) => {
    // Join DM Room
    socket.on("dm:join", async ({ dmId }) => {
        if (!dmId) return;

        try {
            const dm = await DM.findById(dmId);
            if (!dm) {
                socket.emit("error", { message: "DM not found" });
                return;
            }

            // Verify membership
            if (!dm.members.includes(socket.user.id)) {
                socket.emit("error", { message: "Access denied" });
                return;
            }

            const room = `dm:${dmId}`;
            socket.join(room);
            // console.log(`User ${socket.user.username} joined DM ${dmId}`);
        } catch (err) {
            console.error("DM join error:", err);
        }
    });

    // Send Message
    socket.on("dm:message:send", async ({ dmId, content, workspaceId }) => {
        if (!content || !dmId) return;

        try {
            // Verify membership again? Optional but safer.
            const dm = await DM.findById(dmId);
            if (!dm || !dm.members.includes(socket.user.id)) return;

            const message = new Message({
                content,
                sender: socket.user.id,
                dmId,
                workspaceId
            });
            await message.save();

            // Update DM lastMessageAt
            dm.lastMessageAt = Date.now();
            await dm.save();

            // Populate sender
            await message.populate("sender", "username avatar");

            // Broadcast
            io.to(`dm:${dmId}`).emit("dm:message:receive", message);
        } catch (err) {
            console.error("DM message send error:", err);
        }
    });

    // Typing
    socket.on("dm:typing:start", ({ dmId }) => {
        socket.to(`dm:${dmId}`).emit("dm:typing:start", {
            username: socket.user.username,
            dmId
        });
    });

    socket.on("dm:typing:stop", ({ dmId }) => {
        socket.to(`dm:${dmId}`).emit("dm:typing:stop", {
            username: socket.user.username,
            dmId
        });
    });
};
