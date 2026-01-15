import safetyService from '../services/safety.service.js';
import { logAuditEvent } from '../middlewares/audit.middleware.js';

/**
 * Safety Controller
 * Handles crisis detection and safe-circle flow
 */
class SafetyController {
  /**
   * Get grounding exercise
   * GET /safety/grounding
   */
  async getGrounding(req, res) {
    try {
      const { language } = req.session;

      const exercise = safetyService.getGroundingExercise(language);

      res.json({
        success: true,
        exercise,
      });
    } catch (error) {
      console.error('Get grounding error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve grounding exercise',
      });
    }
  }

  /**
   * Get external help resources
   * GET /safety/resources
   */
  async getResources(req, res) {
    try {
      const { language } = req.session;

      const resources = safetyService.getExternalResources(language);

      res.json({
        success: true,
        resources,
      });
    } catch (error) {
      console.error('Get resources error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve resources',
      });
    }
  }

  /**
   * Request emergency contact alert (requires consent)
   * POST /safety/emergency
   */
  async requestEmergencyAlert(req, res) {
    try {
      const { session_id } = req.session;
      const { contact_info, consent_given } = req.body;

      if (!consent_given) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Explicit consent is required for emergency alerts',
        });
      }

      if (!contact_info) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Contact information is required',
        });
      }

      const result = await safetyService.requestEmergencyAlert(
        session_id,
        contact_info,
        consent_given
      );

      // Log audit event
      await logAuditEvent(session_id, 'safety', 'Emergency alert consent given', req);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error('Emergency alert error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to process emergency alert',
      });
    }
  }

  /**
   * Assess safety of a message
   * POST /safety/assess
   */
  async assessSafety(req, res) {
    try {
      const { session_id, language } = req.session;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Message is required',
        });
      }

      const assessment = await safetyService.assessSafety(message);

      // Record safety event
      await safetyService.recordSafetyEvent(
        session_id,
        assessment.tier,
        assessment.flags,
        false
      );

      const response = {
        success: true,
        assessment: {
          tier: assessment.tier,
          flags: assessment.flags,
        },
      };

      // Add grounding if needed
      if (assessment.tier !== 'normal') {
        response.grounding = safetyService.getGroundingExercise(language);
        response.resources = safetyService.getExternalResources(language);
      }

      res.json(response);
    } catch (error) {
      console.error('Assess safety error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to assess safety',
      });
    }
  }
}

const safetyController = new SafetyController();

export default safetyController;

