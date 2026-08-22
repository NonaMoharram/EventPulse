const express = require('express');

const { body, param } = require('express-validator');

const eventController = require('../controllers/eventController');

const requireAuth = require('../middleware/requireAuth');

const requireRole = require('../middleware/requireRole');

const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', eventController.getEvents);

router.get('/:id', eventController.getEventById);

router.post(
    '/',
    requireAuth,
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required'),

        body('category')
            .isMongoId()
            .withMessage('Category must be a valid MongoId'),

        body('date')
            .isISO8601()
            .withMessage('Date must be a valid date'),

        body('capacity')
            .isInt({ min: 1 })
            .withMessage('Capacity must be a positive number')
    ],
    validate,
    requireRole('admin'),
    eventController.createEvent
);

router.patch(
    '/:id',
    [
        param('id')
            .isMongoId()
            .withMessage('ID must be a valid MongoId'),

        body('title')
            .optional()
            .notEmpty()
            .withMessage('Title cannot be empty'),

        body('category')
            .optional()
            .isMongoId()
            .withMessage('Category must be a valid MongoId'),

        body('date')
            .optional()
            .isISO8601()
            .withMessage('Date must be a valid date'),

        body('capacity')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Capacity must be a positive number')
    ],
    validate,
    requireAuth,
    requireRole('admin'),
    eventController.updateEvent
);

router.delete('/:id', requireAuth, requireRole('admin'), eventController.deleteEvent);

module.exports = router;