import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { securityConfig } from '../config/security.js';
import prisma from '../config/db.js';

/**
 * Authentication Middleware
 * Validates JWT tokens and attaches session info to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, securityConfig.jwt.secret);

      // Verify session exists and is active
      const session = await prisma.session.findUnique({
        where: {
          session_id: decoded.session_id,
        },
      });

      if (!session || !session.is_active) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Session expired or invalid',
        });
      }

      // Check if session has expired
      if (new Date() > session.expires_at) {
        // Mark session as inactive
        await prisma.session.update({
          where: { session_id: decoded.session_id },
          data: { is_active: false },
        });

        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Session expired',
        });
      }

      // Update last active timestamp
      await prisma.session.update({
        where: { session_id: decoded.session_id },
        data: { last_active: new Date() },
      });

      // Attach session info to request
      req.session = {
        session_id: decoded.session_id,
        language: decoded.language || 'EN',
        demo: decoded.demo || false,
        sessionData: session,
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Token expired',
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token',
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, securityConfig.jwt.secret);
        const session = await prisma.session.findUnique({
          where: { session_id: decoded.session_id },
        });

        if (session && session.is_active && new Date() <= session.expires_at) {
          req.session = {
            session_id: decoded.session_id,
            language: decoded.language || 'EN',
            demo: decoded.demo || false,
            sessionData: session,
          };
        }
      } catch (error) {
        // Silently fail for optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};

