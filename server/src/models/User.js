const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "", // URL to avatar image
  },
  status: {
    type: String,
    default: "offline", // online, offline, busy
  },
  joinedWorkspaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
