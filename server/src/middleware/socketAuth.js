const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecret"; // move to .env later

function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    socket.user = {
      userId: payload.userId,
      username: payload.username,
    };

    next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
}

module.exports = socketAuth;
