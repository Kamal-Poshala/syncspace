const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Fixed path (was Users)

module.exports = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback_key_change_me";
    const decoded = jwt.verify(token, JWT_SECRET);

    // Note: decoded.userId differs based on sign usage, ensuring consistency
    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId).select("_id username avatar");

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket
    socket.user = {
      id: user._id.toString(),
      username: user.username,
      avatar: user.avatar
    };

    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
};
