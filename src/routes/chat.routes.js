import express from 'express';
import chatController from '../controllers/chat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { defaultRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';

const router = express.Router();

// All chat routes require authentication
router.use(authenticate);
router.use(auditLog);

// Send chat message
router.post('/message', defaultRateLimiter, chatController.sendMessage.bind(chatController));

// Get chat session
router.get('/session', defaultRateLimiter, chatController.getChatSession.bind(chatController));

// Update chat mode
router.put('/mode', defaultRateLimiter, chatController.updateMode.bind(chatController));

export default router;

