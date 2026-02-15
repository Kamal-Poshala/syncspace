const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));
app.use(express.json());

const userRoutes = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes");
const path = require("path");

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/channels", require("./routes/channel.routes"));
app.use("/api/dms", require("./routes/dm.routes")); // Added settings

module.exports = app;
