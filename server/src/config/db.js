const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/syncspace";
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed.");
    if (err.name === 'MongooseServerSelectionError') {
      console.error("CRITICAL: Could not connect to MongoDB Atlas. This is likely an IP Whitelist issue. Ensure 0.0.0.0/0 is allowed in Atlas Network Access.");
    }
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
