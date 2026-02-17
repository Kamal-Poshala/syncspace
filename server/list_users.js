const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config({ path: '.env.railway' });

async function listUsers() {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/syncspace";
        await mongoose.connect(uri);
        const users = await User.find({}, 'username _id');
        console.log(JSON.stringify(users, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listUsers();
