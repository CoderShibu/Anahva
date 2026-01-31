// Chat Routes
import express from 'express';
import * as chatController from '../controllers/chat.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { generalLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

// Send chat message
router.post('/message', generalLimiter, auditLog('chat_message'), chatController.sendMessage);

// Get chat session info
router.get('/session', chatController.getChatSession);

// Update chat mode
router.put('/mode', chatController.updateMode);

export default router;
