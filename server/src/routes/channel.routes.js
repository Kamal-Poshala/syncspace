const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');
const { verifyToken } = require('../middleware/auth');

// Create a new channel
router.post('/', verifyToken, channelController.createChannel);

// Get all channels for a workspace
router.get('/workspace/:workspaceId', verifyToken, channelController.getWorkspaceChannels);

// Get messages for a channel
router.get('/:channelId/messages', verifyToken, channelController.getChannelMessages);

module.exports = router;
