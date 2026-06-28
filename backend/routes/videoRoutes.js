const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateVideo, getMyVideos } = require('../controllers/videocontroller');

// All video routes require authentication
router.post('/generate', protect, generateVideo);
router.get('/my-videos', protect, getMyVideos);

module.exports = router;