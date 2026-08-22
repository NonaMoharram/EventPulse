const express = require('express');
const { body } = require('express-validator');
const announcementController = require('../controllers/announcementController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const router = express.Router();
router.post(
    '/',
    requireAuth,
    requireRole('admin'),
    [
        body('eventId')
            .isMongoId()
            .withMessage('Event ID must be a valid MongoId'),

        body('text')
            .notEmpty()
            .withMessage('Announcement text is required')
    ],
    validate,
    announcementController.postAnnouncement
);
router.get('/:eventId', announcementController.getAnnouncementHistory);
module.exports = router;


