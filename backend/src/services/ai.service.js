// AI Service - Google Gemini Integration
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env.js';

class AIService {
    constructor() {
        this.geminiClient = null;
        this.model = null;

        // Initialize Gemini if API key exists
        if (config.googleApiKey) {
            this.geminiClient = new GoogleGenerativeAI(config.googleApiKey);
            this.model = this.geminiClient.getGenerativeModel({ model: 'gemini-pro' });
            console.log('✅ Google Gemini AI initialized');
        } else {
            console.warn('⚠️  No GOOGLE_API_KEY found. AI will use fallback responses.');
        }
    }

    /**
     * Get system prompt based on mode
     */
    getSystemPrompt(mode, language) {
        const prompts = {
            LISTEN: {
                EN: `You are Anahva, a compassionate mental wellness companion. Your role is to LISTEN with empathy.

STRICT RULES:
❌ NO medical diagnosis
❌ NO medical advice  
❌ NO authority statements ("you should", "you must")
❌ NO behavioral profiling or predictions
✅ USE Socratic questioning
✅ USE empathetic listening
✅ USE open-ended questions
✅ REFLECT feelings back

Keep responses under 150 tokens. Be warm, gentle, and use Indian cultural context when appropriate.`,
                HI: `आप अनहवा हैं, एक दयालु मानसिक स्वास्थ्य साथी। आपकी भूमिका सहानुभूति से सुनना है।`,
            },
            REFLECT: {
                EN: `You are Anahva, guiding gentle self-reflection.

STRICT RULES:
❌ NO medical diagnosis or advice
❌ NO directive statements
❌ NO judgments
✅ USE guided questions for self-discovery
✅ HELP user explore their own thoughts
✅ ENCOURAGE pattern awareness

Keep responses under 200 tokens. Ask thoughtful questions that help users understand themselves.`,
                HI: `आप अनहवा हैं, कोमल आत्म-चिंतन का मार्गदर्शन करते हैं।`,
            },
            CALM: {
                EN: `You are Anahva, providing grounding and calming support.

STRICT RULES:
❌ NO medical advice
❌ NO panic-inducing language
✅ USE grounding techniques (5-4-3-2-1, breathing)
✅ USE calming language
✅ PROVIDE practical exercises
✅ BE reassuring without making promises

Keep responses under 250 tokens. Focus on immediate calming and grounding.`,
                HI: `आप अनहवा हैं, शांति और स्थिरता प्रदान करते हैं।`,
            },
        };

        return prompts[mode]?.[language] || prompts.LISTEN.EN;
    }

    /**
     * Get fallback response when AI unavailable
     */
    getFallbackResponse(mode, language) {
        const fallbacks = {
            LISTEN: {
                EN: "I'm here to listen. Can you tell me more about what you're experiencing?",
                HI: "मैं सुनने के लिए यहाँ हूँ। क्या आप मुझे और बता सकते हैं?",
            },
            REFLECT: {
                EN: "That sounds important. What does this situation mean to you?",
                HI: "यह महत्वपूर्ण लगता है। आपके लिए इसका क्या मतलब है?",
            },
            CALM: {
                EN: "Let's take a moment. Try taking a slow, deep breath in... and out. How are you feeling right now?",
                HI: "आइए एक क्षण लें। धीरे-धीरे गहरी सांस लें... और छोड़ें। अभी आप कैसा महसूस कर रहे हैं?",
            },
        };

        return fallbacks[mode]?.[language] || fallbacks.LISTEN.EN;
    }

    /**
     * Generate AI response
     */
    async generateResponse(message, mode = 'LISTEN', language = 'EN') {
        // Validate inputs
        if (!message || typeof message !== 'string') {
            throw new Error('Invalid message');
        }

        mode = ['LISTEN', 'REFLECT', 'CALM'].includes(mode) ? mode : 'LISTEN';
        language = ['EN', 'HI'].includes(language) ? language : 'EN';

        // If no AI client, use fallback
        if (!this.model) {
            return this.getFallbackResponse(mode, language);
        }

        try {
            // Build prompt
            const systemPrompt = this.getSystemPrompt(mode, language);
            const fullPrompt = `${systemPrompt}

User message: ${message}

Respond with empathy and follow the rules above:`;

            // Generate response
            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                generationConfig: {
                    maxOutputTokens: mode === 'CALM' ? 300 : mode === 'REFLECT' ? 200 : 150,
                    temperature: 0.8,
                    topP: 0.95,
                    topK: 40,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                    },
                ],
            });

            const response = result.response;
            const text = response.text();

            return text || this.getFallbackResponse(mode, language);

        } catch (error) {
            console.error('AI generation error:', error.message);

            // Return fallback on error
            return this.getFallbackResponse(mode, language);
        }
    }
}

export default new AIService();
