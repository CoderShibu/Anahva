import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env.js';

/**
 * AI Service
 * Handles AI interactions with strict safety constraints
 * NO diagnosis, NO medical advice, NO authority statements
 * Socratic questioning only
 * Uses Google Gemini API ONLY in backend
 */
class AIService {
  constructor() {
    // Initialize Gemini ONLY
    if (config.GOOGLE_API_KEY) {
      this.client = new GoogleGenerativeAI(config.GOOGLE_API_KEY);
      this.model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      console.warn('⚠️  No Gemini API key configured. AI features will not work.');
      this.client = null;
    }
  }

  /**
   * Get system prompt with safety constraints
   * @param {string} mode - LISTEN, REFLECT, or CALM
   * @param {string} language - EN or HI
   * @param {boolean} isNightTime - After 11 PM
   * @returns {string} System prompt
   */
  getSystemPrompt(mode = 'LISTEN', language = 'EN', isNightTime = false) {
    const baseConstraints = `
You are Anahva, a compassionate AI companion for mental wellness support in India.

CRITICAL CONSTRAINTS - NEVER VIOLATE:
❌ NO medical diagnosis
❌ NO medical advice
❌ NO authority statements ("you should", "you must")
❌ NO behavioral profiling
❌ NO engagement optimization
✅ Socratic questioning only
✅ Empathetic listening
✅ Grounding techniques
✅ Supportive reflection

Language: ${language === 'HI' ? 'Respond in Hindi (हिंदी)' : 'Respond in English'}
Mode: ${mode}
Time: ${isNightTime ? 'Late night - reduce verbosity, grounding-first' : 'Normal hours'}
`;

    const modeSpecific = {
      LISTEN: 'Your role is to listen empathetically. Ask gentle, open-ended questions. Validate emotions without diagnosing.',
      REFLECT: 'Help the user reflect on their experiences. Use Socratic questioning to guide self-discovery. Never prescribe solutions.',
      CALM: 'Focus on grounding and calming techniques. Offer breathing exercises, mindfulness prompts. Keep responses brief and soothing.',
    };

    return `${baseConstraints}\n\n${modeSpecific[mode] || modeSpecific.LISTEN}`;
  }

  /**
   * Generate AI response
   * @param {string} userMessage - User's message
   * @param {Object} context - Context object
   * @param {string} context.mode - Chat mode
   * @param {string} context.language - Language
   * @param {Array} context.memories - Relevant memories (embeddings context)
   * @param {boolean} context.isNightTime - Is it after 11 PM
   * @returns {Promise<string>} AI response
   */
  async generateResponse(userMessage, context = {}) {
    if (!this.client) {
      // Fallback response if no AI API is configured
      return this.getFallbackResponse(context.mode, context.language);
    }

    const { mode = 'LISTEN', language = 'EN', memories = [], isNightTime = false } = context;

    try {
      const systemPrompt = this.getSystemPrompt(mode, language, isNightTime);
      
      // Build context from memories (if any)
      let memoryContext = '';
      if (memories.length > 0) {
        const lastFew = memories.slice(-3).map((m, i) => `Memory ${i + 1}: ${m.summary || m.text || ''}`).join('\n');
        memoryContext = `\n\nUser's recent emotional history/context:\n${lastFew}`;
      }

      // Add explicit instructions for intelligence, creativity, and emotional depth
      const intelligenceInstructions = `\n\nINSTRUCTIONS:\n- Respond with deep empathy, emotional intelligence, and creativity.\n- If user asks for jokes, share culturally relevant, light-hearted humor.\n- If user expresses distress, offer grounding, validation, and gentle guidance.\n- Always ask thoughtful follow-up questions.\n- Use context and history to personalize responses.\n- Never repeat yourself.\n- If user asks for advice, guide them to self-reflection instead of giving direct answers.\n`;

      const fullPrompt = `${systemPrompt}${memoryContext}${intelligenceInstructions}\n\nUser message: ${userMessage}`;

      // Only Gemini API is used
      const generationConfig = {
        maxOutputTokens: isNightTime ? 150 : 300,
        temperature: mode === 'CALM' ? 0.7 : 0.8,
        topP: 0.9,
        topK: 40,
      };

      const result = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: fullPrompt }],
          },
        ],
        generationConfig,
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      });

      const response = await result.response;
      const text = response.text();
    
      if (!text || text.trim().length === 0) {
        return this.getFallbackResponse(mode, language);
      }

      return text;
    } catch (error) {
      console.error('AI Service Error:', error.message);
      // Never expose technical errors to user
      return this.getFallbackResponse(mode, language);
    }
  }

  /**
   * Fallback response when AI is unavailable
   */
  getFallbackResponse(mode, language) {
    const responses = {
      LISTEN: {
        EN: "I'm here to listen. How are you feeling right now?",
        HI: "मैं यहाँ आपकी बात सुनने के लिए हूँ। आप अभी कैसा महसूस कर रहे हैं?",
      },
      REFLECT: {
        EN: "Let's take a moment to reflect. What comes to mind when you think about this?",
        HI: "आइए एक पल के लिए विचार करें। जब आप इसके बारे में सोचते हैं तो क्या दिमाग में आता है?",
      },
      CALM: {
        EN: "Take a deep breath. You're safe here. Let's ground ourselves together.",
        HI: "गहरी साँस लें। आप यहाँ सुरक्षित हैं। आइए एक साथ शांत हों।",
      },
    };

    return responses[mode]?.[language] || responses.LISTEN[language];
  }

  /**
   * Check for safety flags in message
   * @param {string} message - User message
   * @returns {Object} Safety flags
   */
  checkSafetyFlags(message) {
    const flags = {
      crisis: false,
      selfHarm: false,
      violence: false,
      needsGrounding: false,
    };

    // Simple keyword-based detection (can be enhanced)
    const crisisKeywords = ['suicide', 'kill myself', 'end it', 'no point', 'want to die'];
    const selfHarmKeywords = ['hurt myself', 'cut', 'self harm'];
    const violenceKeywords = ['hurt others', 'kill', 'violence'];
    const groundingKeywords = ['overwhelmed', 'panic', 'anxious', 'scared'];

    const lowerMessage = message.toLowerCase();

    flags.crisis = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    flags.selfHarm = selfHarmKeywords.some(keyword => lowerMessage.includes(keyword));
    flags.violence = violenceKeywords.some(keyword => lowerMessage.includes(keyword));
    flags.needsGrounding = groundingKeywords.some(keyword => lowerMessage.includes(keyword));

    return flags;
  }
}

const aiService = new AIService();

export default aiService;

