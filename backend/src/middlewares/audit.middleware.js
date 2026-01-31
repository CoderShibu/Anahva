// Audit Logging Middleware
import prisma from '../config/db.js';

export async function auditLog(action) {
    return async (req, res, next) => {
        try {
            // Log the action
            await prisma.auditLog.create({
                data: {
                    session_id: req.sessionId || null,
                    action,
                    ip_address: req.ip || req.connection.remoteAddress,
                    user_agent: req.headers['user-agent'],
                    metadata: JSON.stringify({
                        method: req.method,
                        path: req.path,
                    }),
                },
            });
        } catch (error) {
            // Don't fail the request if audit logging fails
            console.error('Audit log error:', error);
        }

        next();
    };
}
