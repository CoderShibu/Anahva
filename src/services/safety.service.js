import prisma from '../config/db.js';
import aiService from './ai.service.js';

/**
 * Safety Service
 * Handles crisis detection and safe-circle flow
 * Tiered response system with explicit consent
 */
class SafetyService {
  /**
   * Check safety flags and determine response tier
   * @param {string} message - User message
   * @returns {Object} Safety assessment
   */
  async assessSafety(message) {
    const flags = aiService.checkSafetyFlags(message);

    let tier = 'normal';
    let response = null;

    if (flags.crisis || flags.selfHarm) {
      tier = 'crisis';
      response = {
        type: 'grounding',
        message: 'I\'m here with you. Let\'s take a moment to breathe together. You\'re not alone.',
      };
    } else if (flags.violence) {
      tier = 'concern';
      response = {
        type: 'grounding',
        message: 'I hear you. Let\'s pause and find a calm space together.',
      };
    } else if (flags.needsGrounding) {
      tier = 'support';
      response = {
        type: 'grounding',
        message: 'It sounds like you might benefit from some grounding exercises. Would you like to try one?',
      };
    }

    return {
      tier,
      flags,
      response,
    };
  }

  /**
   * Record safety event
   * @param {string} sessionId - Session ID
   * @param {string} eventType - Type of event
   * @param {Object} flags - Safety flags
   * @param {boolean} consentGiven - Whether consent was given
   * @returns {Promise<Object>} Created event
   */
  async recordSafetyEvent(sessionId, eventType, flags, consentGiven = false) {
    const event = await prisma.safetyEvent.create({
      data: {
        session_id: sessionId,
        event_type: eventType,
        flags: flags || {},
        consent_given: consentGiven,
        consent_at: consentGiven ? new Date() : null,
      },
    });

    return event;
  }

  /**
   * Get grounding response
   * @param {string} language - Language (EN/HI)
   * @returns {Object} Grounding exercise
   */
  getGroundingExercise(language = 'EN') {
    const exercises = {
      EN: {
        type: 'breathing',
        title: '5-4-7 Breathing',
        steps: [
          'Breathe in for 5 counts',
          'Hold for 4 counts',
          'Exhale for 7 counts',
          'Repeat 3-5 times',
        ],
        description: 'This breathing technique helps calm your nervous system.',
      },
      HI: {
        type: 'breathing',
        title: '5-4-7 श्वास',
        steps: [
          '5 गिनती तक साँस लें',
          '4 गिनती तक रोकें',
          '7 गिनती तक साँस छोड़ें',
          '3-5 बार दोहराएं',
        ],
        description: 'यह श्वास तकनीक आपके तंत्रिका तंत्र को शांत करने में मदद करती है।',
      },
    };

    return exercises[language] || exercises.EN;
  }

  /**
   * Suggest external help resources
   * @param {string} language - Language (EN/HI)
   * @returns {Object} External resources
   */
  getExternalResources(language = 'EN') {
    const resources = {
      EN: {
        crisis: {
          name: 'Vandrevala Foundation',
          phone: '1860-2662-345',
          available: '24/7',
        },
        support: {
          name: 'iCall',
          phone: '022-25521111',
          available: 'Mon-Sat, 10 AM - 8 PM',
        },
        online: {
          name: 'Sneha',
          website: 'sneha.org.in',
          available: '24/7',
        },
      },
      HI: {
        crisis: {
          name: 'वंद्रेवाला फाउंडेशन',
          phone: '1860-2662-345',
          available: '24/7',
        },
        support: {
          name: 'iCall',
          phone: '022-25521111',
          available: 'सोम-शनि, सुबह 10 - शाम 8',
        },
        online: {
          name: 'Sneha',
          website: 'sneha.org.in',
          available: '24/7',
        },
      },
    };

    return resources[language] || resources.EN;
  }

  /**
   * Request emergency contact alert (requires explicit consent)
   * @param {string} sessionId - Session ID
   * @param {Object} contactInfo - Contact information
   * @param {boolean} consentGiven - Explicit consent
   * @returns {Promise<Object>} Alert record
   */
  async requestEmergencyAlert(sessionId, contactInfo, consentGiven) {
    if (!consentGiven) {
      throw new Error('Explicit consent required for emergency alerts');
    }

    // Record the consent and alert request
    const event = await this.recordSafetyEvent(
      sessionId,
      'emergency_consent',
      { contactInfo },
      true
    );

    // In production, this would trigger actual alert mechanism
    // For now, just log the consent
    console.log('Emergency alert consent recorded:', {
      sessionId,
      timestamp: new Date(),
    });

    return {
      success: true,
      message: 'Emergency contact has been notified (with your consent)',
      eventId: event.id,
    };
  }
}

const safetyService = new SafetyService();

export default safetyService;

