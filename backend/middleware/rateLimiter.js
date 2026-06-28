// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Generous global limiter — abuse protection, NOT per-message throttling.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // 120 req/min/IP — normal chat usage never reaches this
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please slow down.' },
});

// Stricter limiter only for auth (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts. Try again later.' },
});

module.exports = { apiLimiter, authLimiter };