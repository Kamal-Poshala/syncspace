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
  await connectDB();

  // Ensure default workspace - Commenting out as we now require owner
  /*
  await Workspace.updateOne(
    { slug: "general" },
    { name: "General" },
    { upsert: true }
  );
  */

  const PORT = process.env.PORT || 3001;
  const HOST = '0.0.0.0';
  server.listen(PORT, HOST, () => {
    console.log(`Server is running!`);
    console.log(`- Local: http://localhost:${PORT}`);
    console.log(`- Network: http://${HOST}:${PORT}`);
    console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})();
