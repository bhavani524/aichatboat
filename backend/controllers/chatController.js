// backend/controllers/chatController.js
const { generateAIResponse } = require('../services/aiService');
const Conversation = require('../models/Conversation');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    let conversation = conversationId
      ? await Conversation.findOne({ _id: conversationId, userId })
      : null;

    if (conversationId && !conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        title: message.slice(0, 60) + (message.length > 60 ? '…' : ''),
        messages: [],
      });
    }

    conversation.messages.push({ role: 'user', content: message, type: 'text' });

    const history = conversation.messages
      .slice(-20)
      .slice(0, -1)
      .map((m) => ({ role: m.role, content: m.content }));

    const aiReply = await generateAIResponse(message, history);

    conversation.messages.push({ role: 'ai', content: aiReply, type: 'text' });
    await conversation.save();

    res.json({ status: 'success', conversationId: conversation._id, reply: aiReply });
  } catch (err) {
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select('_id title updatedAt')
      .limit(50);
    res.json({ status: 'success', conversations });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      userId: req.user.id,
    });
    if (!conversation) return res.status(404).json({ error: 'Conversation not found.' });
    res.json({ status: 'success', messages: conversation.messages });
  } catch (err) {
    next(err);
  }
};

exports.deleteConversation = async (req, res, next) => {
  try {
    const result = await Conversation.findOneAndDelete({
      _id: req.params.conversationId,
      userId: req.user.id,
    });
    if (!result) return res.status(404).json({ error: 'Conversation not found.' });
    res.json({ status: 'success', message: 'Conversation deleted.' });
  } catch (err) {
    next(err);
  }
};