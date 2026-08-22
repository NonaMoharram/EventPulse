const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.registerForEvent = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const eventId = req.body.event;

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    const existing = await Registration.findOne({ event: eventId, attendee: userId });
    if (existing) {
        return res.status(400).json({ message: "You are already registered for this event" });
    }

    const currentCount = await Registration.countDocuments({ event: eventId });
    if (currentCount >= event.capacity) {
        return res.status(400).json({ message: "This event is full" });
    }

    const registration = await Registration.create({ event: eventId, attendee: userId });

    res.status(201).json(registration);
});

exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;

    const registrations = await Registration.find({ attendee: userId }).populate('event');

    res.status(200).json(registrations);
});

exports.cancelRegistration = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const registrationId = req.params.id;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.attendee.toString() !== userId) {
        return res.status(403).json({ message: "You can only cancel your own registration" });
    }

    await registration.deleteOne();

    res.status(200).json({ message: "Registration cancelled successfully" });
});
