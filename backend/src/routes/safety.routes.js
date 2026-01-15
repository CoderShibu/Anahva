import express from 'express';
import safetyController from '../controllers/safety.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { defaultRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';

const router = express.Router();

// All safety routes require authentication
router.use(authenticate);
router.use(auditLog);

// Get grounding exercise
router.get('/grounding', defaultRateLimiter, safetyController.getGrounding.bind(safetyController));

// Get external resources
router.get('/resources', defaultRateLimiter, safetyController.getResources.bind(safetyController));

// Assess safety
router.post('/assess', defaultRateLimiter, safetyController.assessSafety.bind(safetyController));

// Request emergency alert (requires consent)
router.post('/emergency', defaultRateLimiter, safetyController.requestEmergencyAlert.bind(safetyController));

export default router;

