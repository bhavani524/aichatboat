// backend/middleware/validators.js
const { body, validationResult } = require('express-validator');

function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
  }
  next();
}

const registerValidator = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  runValidation,
];

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  runValidation,
];

const messageValidator = [
  body('message').trim().isLength({ min: 1, max: 8000 }).withMessage('Message must be 1–8000 chars.'),
  runValidation,
];

const mediaValidator = [
  body('prompt').trim().isLength({ min: 1, max: 1000 }).withMessage('Prompt required (max 1000 chars).'),
  runValidation,
];

module.exports = { registerValidator, loginValidator, messageValidator, mediaValidator };