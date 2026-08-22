const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Must be a valid email format'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    validate,
    authController.register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Must be a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    validate,
    authController.login
);

module.exports = router;

