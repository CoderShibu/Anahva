
import express from 'express';
import insightController from '../controllers/insight.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { defaultRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';

const router = express.Router();

// All insight routes require authentication
router.use(authenticate);
router.use(auditLog);

// Generate insights
router.get('/generate', defaultRateLimiter, insightController.generateInsights.bind(insightController));
// Weekly Emotional Journey
router.get('/weekly', defaultRateLimiter, insightController.getWeeklyInsights.bind(insightController));
// Health Improvement Graph & 8-Week Journey
router.get('/trend', defaultRateLimiter, insightController.getTrendInsights.bind(insightController));

// Get insights history
router.get('/history', defaultRateLimiter, insightController.getInsightsHistory.bind(insightController));

export default router;

