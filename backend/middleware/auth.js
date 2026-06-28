// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Not authenticated.' });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return next(err); // errorHandler maps JWT errors
  }
}

module.exports = { protect };