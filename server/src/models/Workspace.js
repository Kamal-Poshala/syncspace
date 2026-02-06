const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      unique: true,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    users: [
      {
        userId: String,
        username: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workspace", WorkspaceSchema);
