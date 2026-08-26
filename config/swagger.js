const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EventPulse API Documentation',
            version: '1.0.0',
            description: 'Comprehensive Backend RESTful API for Event Registration and Management Platform',
        },

        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://event-pulse-theta.vercel.app'
                    : 'http://localhost:3000',
                description: process.env.NODE_ENV === 'production'
                    ? 'Production server'
                    : 'Local development server',
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js', './routes/authRoutes.js', './routes/eventRoutes.js', './routes/registrationRoutes.js', './routes/announcementRoutes.js'],
};

module.exports = swaggerJsdoc(options);

