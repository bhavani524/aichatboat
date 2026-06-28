// backend/models/Conversation.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, default: '' },
    type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
    mediaUrl: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'New Chat' },
    messages: [messageSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Conversation', conversationSchema);