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

const io = require("socket.io")(server, {
  cors: { origin: process.env.CLIENT_URL || "*" },
});

io.use(socketAuth);
require("./sockets/workspace")(io);

(async () => {
  // Railway assigns a PORT environment variable, usually not 3001. We MUST use it.
  const PORT = process.env.PORT || 3001;

  console.log("----------------------------------------");
  console.log(`Starting server implementation...`);
  console.log(`Environment PORT: ${process.env.PORT}`);
  console.log(`Final Listening PORT: ${PORT}`);
  console.log(`CLIENT_URL: ${process.env.CLIENT_URL}`);
  console.log("----------------------------------------");

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully listening on port ${PORT}`);

    // Connect to DB after starting listener to satisfy health checks
    connectDB().then(() => {
      console.log('Database connection background initialized');
    }).catch(err => {
      console.error('Database connection failed:', err);
    });
  });
})();
