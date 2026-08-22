const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

describe('Events API Integration Tests', () => {

    let adminToken;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@eventpulse.com',
                password: 'password123'
            });

        adminToken = loginRes.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('GET /api/events should return status 200 OK and an array of events', async () => {
        const res = await request(app)
            .get('/api/events');

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('POST /api/events without a JWT token should return 401 Unauthorized', async () => {
        const res = await request(app)
            .post('/api/events')
            .send({
                title: 'Unauthorized Event'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('fail');
    });

    test('POST /api/events with missing required fields should return 422 Unprocessable Entity', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({});

        expect(res.statusCode).toBe(422);
        expect(res.body.status).toBe('fail');
    });

});