// backend/server.js
const env = require('./config/env'); // validates env FIRST
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const videoRoutes = require('./routes/videoRoutes');

const { errorHandler, notFound } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
connectDB();

// Behind AWS ALB / reverse proxy — trust the first proxy for correct client IPs
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // SPA served separately; avoid CSP breakage
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
      if (env.FRONTEND_URL && origin === env.FRONTEND_URL) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

// Sensible global API limiter (protects against abuse; tuned high so normal use never hits it)
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.PORT, () =>
  console.log(`[server] Running on http://localhost:${env.PORT} (${env.NODE_ENV})`),
);

process.on('unhandledRejection', (reason) =>
  console.error('[unhandledRejection]', reason),
);
process.on('SIGTERM', () => server.close(() => process.exit(0)));

module.exports = app;