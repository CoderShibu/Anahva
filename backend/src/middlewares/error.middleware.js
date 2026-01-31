// Error Handling Middleware

export function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Default error
    let status = 500;
    let message = 'Internal Server Error';

    // Handle specific errors
    if (err.name === 'ValidationError') {
        status = 400;
        message = err.message;
    } else if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized';
    } else if (err.message) {
        message = err.message;
    }

    res.status(status).json({
        error: err.name || 'Error',
        message,
    });
}

export function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
    });
}
