const express = require("express");
const Workspace = require("../models/Workspace");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback_key_change_me";

// Middleware to check auth
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Create Workspace
router.post("/", authenticate, async (req, res) => {
    try {
        const { name, slug } = req.body;
        if (!name || !slug) return res.status(400).json({ message: "Name and slug required" });

        const existing = await Workspace.findOne({ slug });
        if (existing) return res.status(400).json({ message: "Slug already exists" });

        // Note: req.user.userId depends on how it was signed in auth.routes.js.
        // In auth.routes.js we used { userId: user._id.toString() }
        const userId = req.user.userId || req.user.id;

        // Add owner as admin member
        const workspace = await Workspace.create({
            name,
            slug,
            owner: userId,
            members: [{ userId, role: "admin" }],
        });

        // Add to user's joined workspaces
        await User.findByIdAndUpdate(userId, {
            $push: { joinedWorkspaces: workspace._id },
        });

        res.status(201).json(workspace);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating workspace" });
    }
});

// List My Workspaces
router.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        // Find workspaces where members.userId is current user
        const workspaces = await Workspace.find({
            "members.userId": userId,
        }).select("name slug _id");

        res.json(workspaces);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching workspaces" });
    }
});

// Generate Invite Code
router.post("/:slug/invite", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const workspace = await Workspace.findOne({ slug: req.params.slug });

        if (!workspace) return res.status(404).json({ message: "Workspace not found" });
        if (workspace.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only owner can generate invites" });
        }

        // Generate simple 8-char hex code
        const crypto = require("crypto");
        workspace.inviteCode = crypto.randomBytes(4).toString("hex");
        await workspace.save();

        res.json({ inviteCode: workspace.inviteCode });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error generating invite" });
    }
});

// Get Workspace Info by Invite Code
router.get("/join/:code", authenticate, async (req, res) => {
    try {
        const workspace = await Workspace.findOne({ inviteCode: req.params.code })
            .select("name slug owner")
            .populate("owner", "username avatar");

        if (!workspace) return res.status(404).json({ message: "Invalid invite code" });

        res.json(workspace);
    } catch (err) {
        res.status(500).json({ message: "Server error resolving invite" });
    }
});

// Join Workspace
router.post("/join/:code", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const workspace = await Workspace.findOne({ inviteCode: req.params.code });

        if (!workspace) return res.status(404).json({ message: "Invalid invite code" });

        // Check if already member
        const isMember = workspace.members.some(
            (m) => m.userId.toString() === userId
        );

        if (isMember) {
            return res.json({ slug: workspace.slug, message: "Already a member" });
        }

        // Add to workspace members
        workspace.members.push({ userId, role: "editor" });
        await workspace.save();

        // Add to user's joined list
        await User.findByIdAndUpdate(userId, {
            $addToSet: { joinedWorkspaces: workspace._id },
        });

        res.json({ slug: workspace.slug, message: "Joined successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error joining workspace" });
    }
});

// Add Member (Owner only)
router.post("/:slug/add-member", authenticate, async (req, res) => {
    try {
        const { userId: targetUserId } = req.body;
        const currentUserId = req.user.userId || req.user.id;

        const workspace = await Workspace.findOne({ slug: req.params.slug });
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (workspace.owner.toString() !== currentUserId) {
            return res.status(403).json({ message: "Only owner can add members directly" });
        }

        // Check if already exist
        if (workspace.members.some(m => m.userId.toString() === targetUserId)) {
            return res.status(400).json({ message: "User already in workspace" });
        }

        workspace.members.push({ userId: targetUserId, role: "editor" });
        await workspace.save();

        // Update user's joined list
        await User.findByIdAndUpdate(targetUserId, {
            $addToSet: { joinedWorkspaces: workspace._id }
        });

        res.json({ message: "Member added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error adding member" });
    }
});

// Update Workspace (Owner only)
router.put("/:slug", authenticate, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.userId || req.user.id;

        if (!name) return res.status(400).json({ message: "Name is required" });

        const workspace = await Workspace.findOne({ slug: req.params.slug });
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (workspace.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only owner can rename workspace" });
        }

        workspace.name = name;
        await workspace.save();

        res.json(workspace);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating workspace" });
    }
});

// Delete Workspace (Owner only)
router.delete("/:slug", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const workspace = await Workspace.findOne({ slug: req.params.slug });

        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (workspace.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only owner can delete workspace" });
        }

        // Remove workspace reference from all members
        const memberIds = workspace.members.map(m => m.userId);
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $pull: { joinedWorkspaces: workspace._id } }
        );

        // Delete the workspace document
        await Workspace.deleteOne({ _id: workspace._id });

        // TODO: Optionally delete related channels, messages, etc.
        // For now, keeping it simple as per "classic" requirements.

        res.json({ message: "Workspace deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting workspace" });
    }
});

// Get Workspace Details
router.get("/:slug", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const workspace = await Workspace.findOne({ slug: req.params.slug })
            .populate("members.userId", "username avatar status")
            .populate("owner", "username");

        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        // Check if member
        const isMember = workspace.members.some(
            (m) => m.userId?._id.toString() === userId || m.userId?.toString() === userId
        );

        if (!isMember) return res.status(403).json({ message: "Access denied" });

        res.json(workspace);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching workspace details" });
    }
});

module.exports = router;
