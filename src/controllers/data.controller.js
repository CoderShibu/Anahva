import prisma from '../config/db.js';
import journalService from '../services/journal.service.js';
import memoryService from '../services/memory.service.js';
import { logAuditEvent } from '../middlewares/audit.middleware.js';

/**
 * Data Transparency Controller
 * Handles data summary, purge, and memory deletion
 */
class DataController {
  /**
   * Get data summary
   * GET /data/summary
   */
  async getDataSummary(req, res) {
    try {
      const { session_id } = req.session;

      // Get counts (metadata only, no content)
      const journalCount = await journalService.getJournalCount(session_id);
      
      const memoryCount = await prisma.memory.count({
        where: {
          session_id,
          expires_at: {
            gt: new Date(),
          },
        },
      });

      const chatSession = await prisma.chatSession.findFirst({
        where: { session_id },
      });

      const insightCount = await prisma.insight.count({
        where: { session_id },
      });

      res.json({
        success: true,
        summary: {
          journals: journalCount,
          memories: memoryCount,
          chat_sessions: chatSession ? 1 : 0,
          insights: insightCount,
        },
        note: 'This summary contains metadata only. No personal content is stored or accessible.',
      });
    } catch (error) {
      console.error('Get data summary error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve data summary',
      });
    }
  }

  /**
   * Purge all data for session
   * DELETE /data/purge
   */
  async purgeData(req, res) {
    try {
      const { session_id } = req.session;

      // Delete all journals (hard delete)
      await prisma.journal.deleteMany({
        where: { session_id },
      });

      // Delete all memories
      await memoryService.forgetMemories(session_id);

      // Delete chat sessions
      await prisma.chatSession.deleteMany({
        where: { session_id },
      });

      // Delete insights
      await prisma.insight.deleteMany({
        where: { session_id },
      });

      // Delete safety events
      await prisma.safetyEvent.deleteMany({
        where: { session_id },
      });

      // Mark session as inactive
      await prisma.session.update({
        where: { session_id },
        data: { is_active: false },
      });

      // Log audit event
      await logAuditEvent(session_id, 'data_purge', 'All data purged', req);

      res.json({
        success: true,
        message: 'All data has been permanently deleted',
      });
    } catch (error) {
      console.error('Purge data error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to purge data',
      });
    }
  }

  /**
   * Forget memories
   * POST /memory/forget
   */
  async forgetMemories(req, res) {
    try {
      const { session_id } = req.session;

      const deletedCount = await memoryService.forgetMemories(session_id);

      // Log audit event
      await logAuditEvent(session_id, 'memory_forget', `Deleted ${deletedCount} memories`, req);

      res.json({
        success: true,
        message: `Deleted ${deletedCount} memories`,
        count: deletedCount,
      });
    } catch (error) {
      console.error('Forget memories error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete memories',
      });
    }
  }
}

const dataController = new DataController();

export default dataController;

