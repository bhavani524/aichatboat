// backend/middleware/errorHandler.js
const env = require('../config/env');

function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.originalUrl} ->`, {
    message: err.message,
    code: err.code,
    providerStatus: err.providerStatus,
    stack: env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  if (err.code === 'AI_RATE_LIMIT' || err.providerStatus === 429) {
    return res.status(429).json({
      error:
        'The AI provider rate limit/quota was reached. Please wait a moment and try again, or check the API account billing.',
      retryable: true,
    });
  }
  if (err.code === 'AI_AUTH') {
    return res.status(502).json({ error: 'AI service is misconfigured (invalid API key).' });
  }
  if (err.code === 'AI_UNAVAILABLE' || err.providerStatus >= 500) {
    return res.status(502).json({ error: 'The AI service is temporarily unavailable.' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', errors: Object.values(err.errors).map((e) => e.message) });
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid identifier.' });
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token.' });
  if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Session expired. Please log in again.' });

  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: status === 500 ? 'Internal server error.' : err.message });
}

module.exports = { errorHandler, notFound };