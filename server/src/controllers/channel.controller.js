const Channel = require('../models/Channel');
const Workspace = require('../models/Workspace');
const Message = require('../models/Message');

exports.createChannel = async (req, res) => {
    try {
        const { workspaceId, name, isPrivate, topic } = req.body;

        // Check if workspace exists and user is a member
        const workspace = await Workspace.findOne({
            _id: workspaceId,
            members: { $elemMatch: { userId: req.user.userId } }
        });

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found or access denied' });
        }

        const channel = new Channel({
            workspaceId,
            name,
            isPrivate,
            topic,
            members: [req.user.userId] // Creator is always a member
        });

        await channel.save();
        res.status(201).json(channel);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Channel already exists in this workspace' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getWorkspaceChannels = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        // Check access
        const workspace = await Workspace.findOne({
            _id: workspaceId, // Ensure looking up by ID if passed as ID, or handle slug logic in route middleware
            members: { $elemMatch: { userId: req.user.userId } }
        });

        if (!workspace) {
            // If workspaceId is actually a slug, we might need to resolve it, but let's assume ID for now based on REST practices
            return res.status(404).json({ message: 'Workspace not found or access denied' });
        }

        const channels = await Channel.find({ workspaceId });
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const messages = await Message.find({ channelId })
            .sort({ createdAt: 1 }) // Oldest first
            .limit(100)
            .populate('sender', 'username avatar');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
