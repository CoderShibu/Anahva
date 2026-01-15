/**
 * Error Handling Middleware
 * Never exposes technical errors to users
 * Always falls back gracefully
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging (server-side only)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Never expose technical details to user
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
    });
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (err.status === 404) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Resource not found',
    });
  }

  // Generic error response (no technical details)
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong. Please try again later.',
    ...(isDevelopment && { details: err.message }), // Only in development
  });
};

/**
 * 404 Handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
};

