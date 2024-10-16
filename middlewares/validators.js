const { body } = require('express-validator');

// Signup validation
exports.signupValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Login validation
exports.loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
