import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';

const router = express.Router();

// Real signup endpoint
router.post('/signup', authRateLimiter, auditLog, authController.signup.bind(authController));

// Demo login (only in non-production)
router.post('/demo', authRateLimiter, auditLog, authController.demoLogin.bind(authController));

// Anonymous session creation
router.post('/anonymous', authRateLimiter, auditLog, authController.createAnonymousSession.bind(authController));

// Update language (authenticated)
router.put('/language', authenticate, auditLog, authController.updateLanguage.bind(authController));

// Verify session (authenticated)
router.get('/verify', authenticate, authController.verifySession.bind(authController));

// Logout (authenticated)
router.post('/logout', authenticate, auditLog, authController.logout.bind(authController));

export default router;

