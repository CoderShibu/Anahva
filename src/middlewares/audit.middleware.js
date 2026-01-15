import prisma from '../config/db.js';

/**
 * Audit Middleware
 * Logs system events only (no user content)
 */
export const auditLog = async (req, res, next) => {
  // Store original end function
  const originalEnd = res.end;

  // Override end to log after response
  res.end = function (chunk, encoding) {
    // Log audit event after response is sent
    setImmediate(async () => {
      try {
        const eventType = req.route?.path || 'unknown';
        const action = `${req.method} ${req.path}`;
        const sessionId = req.session?.session_id || null;

        // Only log system events, never user content
        await prisma.auditLog.create({
          data: {
            session_id: sessionId,
            event_type: eventType,
            action,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('user-agent') || null,
          },
        });
      } catch (error) {
        // Don't fail request if audit logging fails
        console.error('Audit log error:', error.message);
      }
    });

    // Call original end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Log specific audit event
 * @param {string} sessionId - Session ID
 * @param {string} eventType - Event type
 * @param {string} action - Action description
 * @param {Object} req - Express request object
 */
export const logAuditEvent = async (sessionId, eventType, action, req = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        session_id: sessionId,
        event_type: eventType,
        action,
        ip_address: req?.ip || req?.connection?.remoteAddress || null,
        user_agent: req?.get('user-agent') || null,
      },
    });
  } catch (error) {
    console.error('Audit event log error:', error.message);
  }
};

