const DM = require("../models/DM");
const Message = require("../models/Message");
const User = require("../models/User");

// Get or Create DM between current user and another user in a workspace
exports.getOrCreateDM = async (req, res) => {
    try {
        const { workspaceId, otherUserId } = req.body;
        const currentUserId = req.user.id;

        if (!workspaceId || !otherUserId) {
            return res.status(400).json({ message: "Workspace ID and Other User ID are required" });
        }

        // Sort members to ensure consistent lookup
        const members = [currentUserId, otherUserId].sort();

        let dm = await DM.findOne({
            workspaceId,
            members: { $all: members, $size: 2 } // Exact match for 2 members
        }).populate("members", "username avatar email");

        if (!dm) {
            dm = new DM({
                workspaceId,
                members
            });
            await dm.save();
            await dm.populate("members", "username avatar email");
        }

        res.json(dm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all DMs for user in a workspace
exports.getWorkspaceDMs = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const currentUserId = req.user.id;

        const dms = await DM.find({
            workspaceId,
            members: currentUserId
        })
            .populate("members", "username avatar email")
            .sort({ lastMessageAt: -1 });

        res.json(dms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Messages for a DM
exports.getDMMessages = async (req, res) => {
    try {
        const { dmId } = req.params;
        // Verify membership?
        const dm = await DM.findById(dmId);
        if (!dm) return res.status(404).json({ message: "DM not found" });

        if (!dm.members.includes(req.user.id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        const messages = await Message.find({ dmId })
            .populate("sender", "username avatar")
            .sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
