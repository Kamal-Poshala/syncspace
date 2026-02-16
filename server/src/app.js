const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");

const app = express();
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log requests to help debug
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.get('origin')}`);
    next();
});

// Health check for Railway/Vercel
app.get("/", (req, res) => res.status(200).json({ status: "ok", service: "SyncSpace API" }));
app.get("/health", (req, res) => res.status(200).json({ status: "healthy" }));

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
