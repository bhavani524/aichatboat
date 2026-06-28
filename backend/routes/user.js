// backend/routes/userRoutes.js
const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);

module.exports = router;