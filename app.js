require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const expressMongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.set('io', io);

app.use(morgan('dev'));

// 1. يجب أولاً تفعيل قراءة الـ JSON لكي يفهم السيرفر محتوى الطلب
app.use(express.json());

// 2. تفعيل مكتبة الحماية الرسمية مباشرة بعد الـ JSON لمنع التعارض نهائياً
app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        expressMongoSanitize.sanitize(req.body);
    }

    next();
});

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }'
    })
);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-event', (eventId) => {
        socket.join(eventId);
        console.log(`Socket ${socket.id} joined room: ${eventId}`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.use((req, res, next) => {
    res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.use(errorHandler);

const start = async () => {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    if (process.env.NODE_ENV !== 'test') {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
};

if (process.env.NODE_ENV !== 'test') {
    start();
}

module.exports = app;
