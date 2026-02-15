const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const Workspace = require("./models/Workspace");
const socketAuth = require("./middleware/socketAuth");

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: "*" },
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

  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
})();
