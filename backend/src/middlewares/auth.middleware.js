// Authentication Middleware
import authService from '../services/auth.service.js';

export async function authenticateToken(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided',
            });
        }

        // Verify token
        const decoded = authService.verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token',
            });
        }

        // Get session
        const session = await authService.getSession(decoded.sessionId);
        if (!session) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Session not found or expired',
            });
        }

        // Update last active
        await authService.updateSessionActivity(session.session_id);

        // Attach session to request
        req.session = session;
        req.sessionId = session.session_id;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed',
        });
    }
}
