import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { defaultRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';
import dataController from '../controllers/data.controller.js';

const router = express.Router();

// All settings routes require authentication
router.use(authenticate);
router.use(auditLog);

// Data transparency endpoints
router.get('/data/summary', defaultRateLimiter, dataController.getDataSummary.bind(dataController));
router.delete('/data/purge', defaultRateLimiter, dataController.purgeData.bind(dataController));
router.post('/memory/forget', defaultRateLimiter, dataController.forgetMemories.bind(dataController));

export default router;

