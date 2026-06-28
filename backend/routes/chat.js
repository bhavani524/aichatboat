// backend/routes/chatRoutes.js
const router = require('express').Router();
const ctrl = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { messageValidator } = require('../middleware/validators');

router.post('/message', protect, messageValidator, ctrl.sendMessage);
router.get('/conversations', protect, ctrl.getConversations);
router.get('/history/:conversationId', protect, ctrl.getHistory);
router.delete('/conversation/:conversationId', protect, ctrl.deleteConversation);

module.exports = router;