const AppError = require('../../utils/AppError');

describe('AppError Utility Unit Tests', () => {
    test('should produce statusCode 404 and status fail for a 4xx error', () => {
        const error = new AppError('Not found', 404);
        expect(error.statusCode).toBe(404);
        expect(error.status).toBe('fail');
    });

    test('should produce statusCode 500 and status error for a 5xx error', () => {
        const error = new AppError('Server error', 500);
        expect(error.statusCode).toBe(500);
        expect(error.status).toBe('error');
    });

    test('should default isOperational property to true', () => {
        const error = new AppError('Operational error', 400);
        expect(error.isOperational).toBe(true);
    });

    test('should be an instance of native JavaScript Error', () => {
        const error = new AppError('Native check', 400);
        expect(error).toBeInstanceOf(Error);
    });
});
