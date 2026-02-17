const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const fs = require('fs');
require('dotenv').config({ path: '.env.railway' });

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback_key_change_me";

async function generateToken(username) {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/syncspace";
        await mongoose.connect(uri);
        const user = await User.findOne({ username });
        if (!user) {
            console.error(`User ${username} not found`);
            process.exit(1);
        }

        const token = jwt.sign(
            { userId: user._id.toString(), username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        fs.writeFileSync('output_token.txt', token);
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

const targetUsername = process.argv[2] || 'kamal';
generateToken(targetUsername);
