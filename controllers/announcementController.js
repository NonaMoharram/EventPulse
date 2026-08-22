const Message = require('../models/Message');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.postAnnouncement = asyncHandler(async (req, res, next) => {
    const { eventId, text } = req.body;
    const senderId = req.user.userId;

    const announcement = await Message.create({
        event: eventId,
        sender: senderId,
        text
    });

    const io = req.app.get('io');
    io.to(eventId).emit('announcement', announcement);

    res.status(201).json({
        status: 'success',
        data: { announcement }
    });
});

exports.getAnnouncementHistory = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;

    const history = await Message.find({ event: eventId })
        .sort({ createdAt: 1 })
        .populate('sender', 'name email');

    res.status(200).json({
        status: 'success',
        data: { history }
    });
});
