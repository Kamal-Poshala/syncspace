const mongoose = require("mongoose");

const DMSchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensure unique DM per pair of users in a workspace
// This is a bit complex as [A, B] is same as [B, A]
// We will handle this in controller by sorting members before query/save
// But we can add an index here if we trust controller.

module.exports = mongoose.model("DM", DMSchema);
