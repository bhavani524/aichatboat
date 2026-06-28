// backend/config/env.js
const dotenv = require('dotenv');
dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET', 'GROQ_API_KEY'];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[FATAL] Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  AI_MODEL: process.env.AI_MODEL || 'GROQ',
  AI_MAX_RETRIES: Number(process.env.AI_MAX_RETRIES || 3),
  AI_PROVIDER: process.env.AI_PROVIDER || 'GROQ',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  VIDEO_API_KEY: process.env.VIDEO_API_KEY || '',
  VIDEO_PROVIDER: process.env.VIDEO_PROVIDER || 'runway',
};