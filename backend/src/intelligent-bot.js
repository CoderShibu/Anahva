// Intelligent context-aware chatbot (while Gemini is being fixed)
export function intelligentResponse(message, mode = 'LISTEN') {
    const msg = message.toLowerCase();

    // Detect emotions and topics
    const emotions = {
        sad: /sad|depressed|down|low|unhappy|miserable|crying|tears/i.test(message),
        anxious: /anxious|worried|nervous|afraid|scared|panic|stress/i.test(message),
        angry: /angry|mad|frustrated|annoyed|irritated|furious/i.test(message),
        lonely: /lonely|alone|isolated|nobody|no one/i.test(message),
        overwhelmed: /overwhelmed|too much|can't handle|drowning|exhausted/i.test(message),
        hopeless: /hopeless|no point|give up|worthless|pointless/i.test(message),
    };

    const topics = {
        work: /work|job|boss|colleague|office|career|project/i.test(message),
        family: /family|parents|mom|dad|brother|sister|relative/i.test(message),
        relationship: /relationship|partner|boyfriend|girlfriend|spouse|husband|wife/i.test(message),
        school: /school|college|university|exam|study|student|teacher/i.test(message),
        health: /health|sick|ill|pain|doctor|hospital|medical/i.test(message),
    };

    // Context-aware responses
    if (emotions.hopeless || /suicide|kill myself|end it/i.test(message)) {
        return "I hear how much pain you're in right now. Your feelings are valid, but I'm worried about you. Please reach out to a counselor or call a helpline. You don't have to face this alone. Would you like me to help you find support resources?";
    }

    if (emotions.anxious && topics.work) {
        return mode === 'CALM'
            ? "Work stress can feel crushing. Take a slow breath - let's ground you  here and now. What's one small thing you can control right now?"
            : "I hear that work is weighing heavily on you. It sounds really overwhelming. What part of it feels most stressful right now?";
    }

    if (emotions.anxious && topics.school) {
        return mode === 'CALM'
            ? "Exam pressure is real. Let's take a breath together. You've prepared more than you think. What's one thing you DO know well?"
            : "Academic stress can feel all-consuming. It sounds like you're carrying a lot. How are you taking care of yourself through this?";
    }

    if (emotions.lonely) {
        return mode === 'REFLECT'
            ? "Loneliness can feel so heavy. When do you feel most connected to yourself, even when you're alone?"
            : "I'm here with you. Feeling alone is hard. You're not invisible - I see you, and what you're feeling matters. What would connection feel like for you right now?";
    }

    if (emotions.sad && topics.relationship) {
        return mode === 'REFLECT'
            ? "Relationship pain goes deep. What does this situation tell you about what you need in relationships?"
            : "Relationship struggles hurt in such a tender way. I'm sorry you're going through this. Do you want to talk about what happened?";
    }

    if (emotions.angry) {
        return mode === 'CALM'
            ? "That anger is real and valid. Let's channel it - take a breath, feel your feet on the ground. What do you need right now to feel heard?"
            : "I can feel the frustration in your words. Anger often comes from hurt or injustice. What happened that made you feel this way?";
    }

    if (emotions.overwhelmed) {
        return mode === 'CALM'
            ? "When everything feels like too much, let's start with right now. One breath. Then another. What's ONE thing you can let go of, even just for today?"
            : "Being overwhelmed is exhausting. It sounds like you're juggling so much. What's taking the most energy from you right now?";
    }

    // Check for questions
    if (/\?|how do|what should|can you|help me/i.test(message)) {
        return mode === 'REFLECT'
            ? "That's a thoughtful question. What does your gut tell you? Sometimes we know more than we think we do."
            : "I hear you're looking for direction. While I can't give advice, I can help you explore what feels right for YOU. What options are you considering?";
    }

    // Positive expressions
    if (/better|good|happy|great|okay|fine/i.test(message)) {
        return mode === 'REFLECT'
            ? "I'm glad to hear that. What helped you feel this way?"
            : "That's wonderful to hear. Tell me more about what's feeling good for you?";
    }

    // Default contextual responses by mode
    const defaults = {
        LISTEN: [
            "I'm listening. Tell me more about what you're experiencing.",
            "That sounds really significant. How is that affecting you?",
            "I hear you. What's this like for you right now?",
            "Thank you for sharing that with me. What else is on your mind?",
        ],
        REFLECT: [
            "What do you think this feeling is trying to tell you?",
            "How do you usually respond when you feel this way?",
            "What would make this situation feel more manageable?",
            "If a friend told you this, what would you say to them?",
        ],
        CALM: [
            "Let's take this moment by moment. Take a breath. How does your body feel right now?",
            "You're safe here. Let's ground ourselves - what are three things you can see around you?",
            "One breath at a time. You don't have to solve everything right now.",
            "Feel your feet on the ground. You're here, you're present, you're okay.",
        ],
    };

    const responses = defaults[mode] || defaults.LISTEN;
    return responses[Math.floor(Math.random() * responses.length)];
}
