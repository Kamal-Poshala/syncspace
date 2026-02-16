const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const Workspace = require("./models/Workspace");
const socketAuth = require("./middleware/socketAuth");

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: process.env.CLIENT_URL || "*" },
});

io.use(socketAuth);
require("./sockets/workspace")(io);

(async () => {
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);

    // Connect to DB after starting listener to satisfy health checks
    connectDB().then(() => {
      console.log('Database connection background initialized');
    }).catch(err => {
      console.error('Database connection failed:', err);
    });
  });
})();
