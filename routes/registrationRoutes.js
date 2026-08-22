const express = require('express');
const { body } = require('express-validator');
const registrationController = require('../controllers/registrationController');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');
const router = express.Router();
router.use(requireAuth);
router.post(
    '/',
    body('event')
        .isMongoId()
        .withMessage('Event must be a valid MongoId'),
    validate,
    registrationController.registerForEvent
);
router.get('/my', registrationController.getMyRegistrations);
router.delete('/:id', registrationController.cancelRegistration);
module.exports = router;


