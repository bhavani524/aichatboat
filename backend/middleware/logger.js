// backend/middleware/logger.js
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[req] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
}
module.exports = { requestLogger };