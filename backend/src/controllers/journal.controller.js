import journalService from '../services/journal.service.js';
import { logAuditEvent } from '../middlewares/audit.middleware.js';

/**
 * Journal Controller
 * Handles journal CRUD operations
 */
class JournalController {
  /**
   * Create journal entry
   * POST /journal/create
   */
  async createJournal(req, res) {
    try {
      const { session_id } = req.session;
      const { encrypted_payload, allow_ai_memory = false } = req.body;

      if (!encrypted_payload) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Encrypted payload is required',
        });
      }

      const journal = await journalService.createJournal(
        session_id,
        encrypted_payload,
        allow_ai_memory
      );

      // Log audit event
      await logAuditEvent(session_id, 'journal', 'Journal entry created', req);

      res.status(201).json({
        success: true,
        journal,
      });
    } catch (error) {
      console.error('Create journal error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create journal entry',
      });
    }
  }

  /**
   * Get journal entries
   * GET /journal/list
   */
  async getJournals(req, res) {
    try {
      const { session_id } = req.session;
      const limit = parseInt(req.query.limit || '50', 10);
      const offset = parseInt(req.query.offset || '0', 10);

      const journals = await journalService.getJournals(session_id, limit, offset);
      const count = await journalService.getJournalCount(session_id);

      res.json({
        success: true,
        journals,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: offset + limit < count,
        },
      });
    } catch (error) {
      console.error('Get journals error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve journal entries',
      });
    }
  }

  /**
   * Delete journal entry
   * DELETE /journal/:id
   */
  async deleteJournal(req, res) {
    try {
      const { session_id } = req.session;
      const { id } = req.params;

      await journalService.deleteJournal(session_id, id);

      // Log audit event
      await logAuditEvent(session_id, 'journal', `Journal entry ${id} deleted`, req);

      res.json({
        success: true,
        message: 'Journal entry deleted',
      });
    } catch (error) {
      console.error('Delete journal error:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Journal entry not found',
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete journal entry',
      });
    }
  }
}

const journalController = new JournalController();

export default journalController;

