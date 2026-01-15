import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/env.js';
import { securityConfig } from '../config/security.js';
import prisma from '../config/db.js';
import { logAuditEvent } from '../middlewares/audit.middleware.js';

/**
 * Authentication Controller
 * Handles login, session creation, and JWT issuance
 */
class AuthController {
    /**
     * Real signup endpoint (creates session and returns JWT)
     */
    async signup(req, res) {
      try {
        const { name, password, language = 'EN' } = req.body;
        if (!name || !password) {
          return res.status(400).json({ error: 'Bad Request', message: 'Name and password are required' });
        }
        // TODO: Add real user creation logic here (e.g. check if user exists, hash password, store user)
        // For now, just create a session for every signup
        const sessionId = uuidv4();
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + securityConfig.session.timeout);
        const session = await prisma.session.create({
          data: {
            session_id: sessionId,
            language,
            demo: false,
            expires_at: expiresAt,
          },
        });
        // Generate JWT
        const token = jwt.sign(
          { session_id: sessionId, language, demo: false },
          securityConfig.jwt.secret,
          { expiresIn: securityConfig.jwt.expiresIn }
        );
        await logAuditEvent(sessionId, 'signup', 'User signup and session created', req);
        res.json({ success: true, token, session: { session_id: sessionId, language, demo: false } });
      } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Signup failed' });
      }
    }
  /**
   * Demo login (only in non-production)
   */
  async demoLogin(req, res) {
    try {
      if (!config.DEMO_MODE_ENABLED) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Demo mode is disabled in production',
        });
      }

      const { name, password } = req.body;

      if (!name || !password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Name and password are required',
        });
      }

      // Validate demo credentials
      if (name !== config.DEMO_USERNAME || password !== config.DEMO_PASSWORD) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid credentials',
        });
      }

      // Create session
      const sessionId = uuidv4();
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + securityConfig.session.timeout);

      const session = await prisma.session.create({
        data: {
          session_id: sessionId,
          language: 'EN', // Default, can be updated
          demo: true,
          expires_at: expiresAt,
        },
      });

      // Generate JWT
      const token = jwt.sign(
        {
          session_id: sessionId,
          language: 'EN',
          demo: true,
        },
        securityConfig.jwt.secret,
        {
          expiresIn: securityConfig.jwt.expiresIn,
        }
      );

      // Log audit event
      await logAuditEvent(sessionId, 'login', 'Demo login successful', req);

      res.json({
        success: true,
        token,
        session: {
          session_id: sessionId,
          language: 'EN',
          demo: true,
        },
      });
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Login failed',
      });
    }
  }

  /**
   * Anonymous session creation
   */
  async createAnonymousSession(req, res) {
    try {
      const { language = 'EN' } = req.body;

      if (!['EN', 'HI'].includes(language)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Language must be EN or HI',
        });
      }

      // Create anonymous session
      const sessionId = uuidv4();
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + securityConfig.session.timeout);

      const session = await prisma.session.create({
        data: {
          session_id: sessionId,
          language,
          demo: false,
          expires_at: expiresAt,
        },
      });

      // Generate JWT
      const token = jwt.sign(
        {
          session_id: sessionId,
          language,
          demo: false,
        },
        securityConfig.jwt.secret,
        {
          expiresIn: securityConfig.jwt.expiresIn,
        }
      );

      // Log audit event
      await logAuditEvent(sessionId, 'login', 'Anonymous session created', req);

      res.json({
        success: true,
        token,
        session: {
          session_id: sessionId,
          language,
          demo: false,
        },
      });
    } catch (error) {
      console.error('Anonymous session error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Session creation failed',
      });
    }
  }

  /**
   * Update session language
   */
  async updateLanguage(req, res) {
    try {
      const { language } = req.body;
      const { session_id } = req.session;

      if (!['EN', 'HI'].includes(language)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Language must be EN or HI',
        });
      }

      // Update session
      await prisma.session.update({
        where: { session_id },
        data: { language },
      });

      // Generate new JWT with updated language
      const token = jwt.sign(
        {
          session_id,
          language,
          demo: req.session.demo,
        },
        securityConfig.jwt.secret,
        {
          expiresIn: securityConfig.jwt.expiresIn,
        }
      );

      res.json({
        success: true,
        token,
        language,
      });
    } catch (error) {
      console.error('Update language error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Language update failed',
      });
    }
  }

  /**
   * Logout / Invalidate session
   */
  async logout(req, res) {
    try {
      const { session_id } = req.session;

      // Mark session as inactive
      await prisma.session.update({
        where: { session_id },
        data: { is_active: false },
      });

      // Log audit event
      await logAuditEvent(session_id, 'logout', 'Session invalidated', req);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Logout failed',
      });
    }
  }

  /**
   * Verify token and return session info
   */
  async verifySession(req, res) {
    try {
      const { session_id, language, demo } = req.session;

      res.json({
        success: true,
        session: {
          session_id,
          language,
          demo,
        },
      });
    } catch (error) {
      console.error('Verify session error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Session verification failed',
      });
    }
  }
}

const authController = new AuthController();

export default authController;

