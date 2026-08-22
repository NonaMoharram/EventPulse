const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler Utility Unit Tests', () => {
    test('should correctly invoke the wrapped controller function with req, res, and next parameters', async () => {
        const mockFn = jest.fn((req, res, next) => Promise.resolve());
        const wrappedFn = asyncHandler(mockFn);
        
        const req = {};
        const res = {};
        const next = jest.fn();

        await wrappedFn(req, res, next);

        expect(mockFn).toHaveBeenCalledWith(req, res, next);
    });

    test('should catch rejected error and pass it to next() if wrapped function throws', async () => {
        const expectedError = new Error('Async Error');
        const mockFn = jest.fn((req, res, next) => Promise.reject(expectedError));
        const wrappedFn = asyncHandler(mockFn);

        const req = {};
        const res = {};
        const next = jest.fn();

        await wrappedFn(req, res, next);

        expect(next).toHaveBeenCalledWith(expectedError);
    });
});
