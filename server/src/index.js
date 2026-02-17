const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const Workspace = require("./models/Workspace");
const socketAuth = require("./middleware/socketAuth");

// Global error handlers for production diagnostics
process.on('uncaughtException', (err) => {
  console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

const server = http.createServer(app);

const allowedOrigins = [
  "https://syncspace-frontend-six.vercel.app",
  "http://localhost:5173",
  process.env.CLIENT_URL // fallback
].filter(Boolean); // Filter out undefined fallback

const io = require("socket.io")(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log(`Socket CORS Blocked: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ["GET", "POST"]
  },
});

io.use(socketAuth);
require("./sockets/workspace")(io);

const PORT = parseInt(process.env.PORT || '3001', 10);

console.log("----------------------------------------");
console.log(`[STARTUP] Starting server...`);
console.log(`[STARTUP] Environment raw PORT: '${process.env.PORT}'`);
console.log(`[STARTUP] Final Listening PORT: ${PORT}`);
console.log(`[STARTUP] CLIENT_URL: ${process.env.CLIENT_URL}`);
console.log("----------------------------------------");

server.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  console.log(`[SUCCESS] Server successfully bound to port ${PORT} (IPv4)`);
  console.log(`[DEBUG] Server address info:`, typeof address === 'string' ? address : JSON.stringify(address));

  // Connect to DB only after server is proven to be listening
  connectDB().then(() => {
    console.log('[DB] Database connection initialized');
  }).catch(err => {
    console.error('[DB] Database connection failed:', err);
  });
});

server.on('error', (error) => {
  console.error('[FATAL] Server listen error:', error);
  process.exit(1);
});
