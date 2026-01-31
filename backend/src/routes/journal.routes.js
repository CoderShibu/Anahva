// Journal Routes
import express from 'express';
import * as journalController from '../controllers/journal.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { generalLimiter } from '../middlewares/rateLimit.middleware.js';
import { auditLog } from '../middlewares/audit.middleware.js';

const router = express.Router();

// All journal routes require authentication
router.use(authenticateToken);

// Create journal entry
router.post('/create', generalLimiter, auditLog('create_journal'), journalController.createJournal);

// List journal entries
router.get('/list', journalController.listJournals);

// Delete journal entry
router.delete('/:id', auditLog('delete_journal'), journalController.deleteJournal);

export default router;
