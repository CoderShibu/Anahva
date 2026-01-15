import aiService from '../services/ai.service.js';
import memoryService from '../services/memory.service.js';
import safetyService from '../services/safety.service.js';
import prisma from '../config/db.js';
import { logAuditEvent } from '../middlewares/audit.middleware.js';

/**
 * Chat Controller
 * Handles AI chat interactions with safety constraints
 */
class ChatController {
  /**
   * Send chat message
   * POST /chat/message
   */
  async sendMessage(req, res) {
    try {
      const { session_id, language, sessionData } = req.session;
      const { message, mode = 'LISTEN', allow_memory = false } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Message is required',
        });
      }

      if (!['LISTEN', 'REFLECT', 'CALM'].includes(mode)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Mode must be LISTEN, REFLECT, or CALM',
        });
      }

      // Check for safety flags
      const safetyAssessment = await safetyService.assessSafety(message);

      // Record safety event if needed
      if (safetyAssessment.tier !== 'normal') {
        await safetyService.recordSafetyEvent(
          session_id,
          safetyAssessment.tier,
          safetyAssessment.flags,
          false
        );
      }

      // Get or create chat session
      let chatSession = await prisma.chatSession.findFirst({
        where: { session_id },
      });

      if (!chatSession) {
        chatSession = await prisma.chatSession.create({
          data: {
            session_id,
            mode,
          },
        });
      } else if (chatSession.mode !== mode) {
        await prisma.chatSession.update({
          where: { id: chatSession.id },
          data: { mode, last_message_at: new Date() },
        });
      } else {
        await prisma.chatSession.update({
          where: { id: chatSession.id },
          data: { last_message_at: new Date() },
        });
      }

      // Check if it's night time (after 11 PM)
      const now = new Date();
      const isNightTime = now.getHours() >= 23;

      // Get relevant memories if allowed
      let memories = [];
      if (allow_memory) {
        memories = await memoryService.getRelevantMemories(session_id, message, 5);
      }

      // Generate AI response
      const aiResponse = await aiService.generateResponse(message, {
        mode,
        language,
        memories,
        isNightTime,
      });

      // Store memory if allowed (embedding only)
      if (allow_memory) {
        try {
          await memoryService.storeMemory(session_id, message, 'chat');
        } catch (error) {
          console.error('Failed to store memory:', error.message);
          // Don't fail the request if memory storage fails
        }
      }

      // Log audit event (safety flags only, no content)
      await logAuditEvent(
        session_id,
        'chat',
        `Chat message sent (mode: ${mode}, safety: ${safetyAssessment.tier})`,
        req
      );

      // Return response with safety info if needed
      const response = {
        success: true,
        response: aiResponse,
        mode,
        safety: {
          tier: safetyAssessment.tier,
          needsGrounding: safetyAssessment.tier !== 'normal',
        },
      };

      // Add grounding exercise if needed
      if (safetyAssessment.tier !== 'normal') {
        response.grounding = safetyService.getGroundingExercise(language);
      }

      res.json(response);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to process message',
      });
    }
  }

  /**
   * Get chat session info
   * GET /chat/session
   */
  async getChatSession(req, res) {
    try {
      const { session_id } = req.session;

      const chatSession = await prisma.chatSession.findFirst({
        where: { session_id },
      });

      if (!chatSession) {
        return res.json({
          success: true,
          session: null,
          message: 'No active chat session',
        });
      }

      res.json({
        success: true,
        session: {
          mode: chatSession.mode,
          created_at: chatSession.created_at,
          last_message_at: chatSession.last_message_at,
        },
      });
    } catch (error) {
      console.error('Get chat session error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve chat session',
      });
    }
  }

  /**
   * Update chat mode
   * PUT /chat/mode
   */
  async updateMode(req, res) {
    try {
      const { session_id } = req.session;
      const { mode } = req.body;

      if (!['LISTEN', 'REFLECT', 'CALM'].includes(mode)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Mode must be LISTEN, REFLECT, or CALM',
        });
      }

      let chatSession = await prisma.chatSession.findFirst({
        where: { session_id },
      });

      if (!chatSession) {
        chatSession = await prisma.chatSession.create({
          data: {
            session_id,
            mode,
          },
        });
      } else {
        await prisma.chatSession.update({
          where: { id: chatSession.id },
          data: { mode },
        });
      }

      res.json({
        success: true,
        mode,
      });
    } catch (error) {
      console.error('Update mode error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update chat mode',
      });
    }
  }
}

const chatController = new ChatController();

export default chatController;

