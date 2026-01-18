const express = require('express');
const { sendMessage, receiveMessage, getHistory } = require('../controllers/messageController');
const router = express.Router();

router.post('/send', sendMessage);
router.post('/webhook', receiveMessage);
router.get('/history', getHistory);

module.exports = router;
