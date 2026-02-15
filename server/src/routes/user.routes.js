const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback_key_change_me";

// Middleware
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

// Search Users
router.get("/search", authenticate, async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) return res.json([]);

        // Case-insensitive search, excluding current user
        const users = await User.find({
            username: { $regex: query, $options: "i" },
            _id: { $ne: req.user.userId || req.user.id }
        })
            .select("username avatar _id")
            .limit(10);

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error searching users" });
    }
});

// Update Profile
router.put("/update", authenticate, async (req, res) => {
    try {
        const { username, avatar, password } = req.body;
        const userId = req.user.userId || req.user.id;

        const updates = {};
        if (username) updates.username = username;
        if (avatar) updates.avatar = avatar;
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        // Check if username taken (if changing)
        if (username) {
            const existing = await User.findOne({ username, _id: { $ne: userId } });
            if (existing) return res.status(400).json({ message: "Username already taken" });
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true })
            .select("-password");

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating profile" });
    }
});

module.exports = router;
