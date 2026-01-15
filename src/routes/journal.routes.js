import express from 'express';
import journalController from '../controllers/journal.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { defaultRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';

const router = express.Router();

// All journal routes require authentication
router.use(authenticate);
router.use(auditLog);

// Create journal entry
router.post('/create', defaultRateLimiter, journalController.createJournal.bind(journalController));

// Get journal entries
router.get('/list', defaultRateLimiter, journalController.getJournals.bind(journalController));

// Delete journal entry
router.delete('/:id', defaultRateLimiter, journalController.deleteJournal.bind(journalController));

export default router;

