// Authentication Routes
import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';

const router = express.Router();

// Demo login (development only)
router.post('/demo', authLimiter, auditLog('demo_login'), authController.demoLogin);

// Anonymous session
router.post('/anonymous', authLimiter, auditLog('anonymous_login'), authController.anonymousLogin);

// Verify session (requires auth)
router.get('/verify', authenticateToken, authController.verifySession);

// Logout (requires auth)
router.post('/logout', authenticateToken, auditLog('logout'), authController.logout);

export default router;
