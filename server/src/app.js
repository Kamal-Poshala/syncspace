const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");

const app = express();

app.use(express.json());

// -- CRITICAL: Health checks MUST be before CORS --
// Railway/Vercel health checks often have no Origin header
app.get("/", (req, res) => res.status(200).json({ status: "ok", service: "SyncSpace API" }));
app.get("/health", (req, res) => res.status(200).json({ status: "healthy" }));

// Robust CORS configuration
const allowedOrigins = [
    "https://syncspace-frontend-six.vercel.app",
    "http://localhost:5173",
    process.env.CLIENT_URL // Include env var just in case
];
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // TEMPORARY: Allow all origins but LOG them to identify the blocker
        console.log(`[CORS DEBUG] Request from Origin: ${origin}`);

        // Check if origin is in our explicit allowed list (just for info)
        const isAllowed = allowedOrigins.includes(origin) || origin === clientUrl;
        if (!isAllowed) {
            console.warn(`[CORS WARNING] Origin ${origin} is not in explicit allowlist but permitted temporarily.`);
        }

        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Log requests to help debug
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.get('origin')}`);
    next();
});

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
