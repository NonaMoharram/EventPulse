const errorHandler = (err, req, res, next) => {
    console.error('❌❌❌ ERROR STACK TRACE:', err.stack);
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors).map(el => el.message).join(', ');
        error.statusCode = 400;
        error.status = 'fail';
    }

    if (err.name === 'CastError') {
        error.message = `Invalid ID format: ${err.value}`;
        error.statusCode = 400;
        error.status = 'fail';
    }

    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 409;
        error.status = 'fail';
    }

    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
};

module.exports = errorHandler;

