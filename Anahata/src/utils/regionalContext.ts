const indianEmotionalPhrases = [
  'parents expect',
  'relatives keep asking',
  'family pressure',
  'academic rank',
  'comparison culture',
  'career guilt',
  'everyone else is',
  'my parents want',
  'society expects',
  'what will people say',
  'log kya kahenge',
  'beta',
  'shaadi',
  'job',
  'exam',
  'marks',
  'rank',
];

const indianContextualResponses = {
  familyPressure: [
    "I understand that family expectations can feel heavy. In Indian families, love and expectations often come together. How does it feel to carry both?",
    "Family expectations, especially in our culture, can create a lot of internal conflict. You're allowed to feel both love and pressure at the same time.",
    "It's okay to feel torn between what your family wants and what you need. Both feelings are valid.",
  ],
  academicStress: [
    "Academic pressure in India is real and intense. Your worth isn't measured by marks or ranks, even when it feels that way.",
    "I hear how much pressure you're under. Exams and rankings don't define who you are, though I know it can feel that way.",
    "The academic system here can be overwhelming. How are you taking care of yourself through this?",
  ],
  comparison: [
    "Comparison culture is deeply embedded in our society. It's exhausting, isn't it? You don't have to measure yourself against anyone else.",
    "I understand how constant comparison can make you feel. Your journey is uniquely yours, even when others try to measure it.",
    "Comparison steals joy. In a culture that constantly compares, choosing to see your own path takes courage.",
  ],
  careerGuilt: [
    "Career choices in India often come with family expectations. It's okay to want something different while still loving your family.",
    "Feeling guilty about career choices is common here. You're allowed to pursue what feels right for you, even if it's different.",
    "The tension between what you want and what's expected can be painful. Both are valid feelings.",
  ],
  default: [
    "I'm here with you. How are you feeling in this moment?",
    "Thank you for sharing. What would help you feel more supported right now?",
    "I hear you. Would you like to explore that feeling a bit more?",
  ],
};

export const detectIndianContext = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  if (indianEmotionalPhrases.some(phrase => lowerText.includes(phrase))) {
    if (lowerText.includes('parent') || lowerText.includes('family') || lowerText.includes('expect')) {
      return indianContextualResponses.familyPressure[
        Math.floor(Math.random() * indianContextualResponses.familyPressure.length)
      ];
    }
    if (lowerText.includes('exam') || lowerText.includes('mark') || lowerText.includes('rank') || lowerText.includes('academic')) {
      return indianContextualResponses.academicStress[
        Math.floor(Math.random() * indianContextualResponses.academicStress.length)
      ];
    }
    if (lowerText.includes('compar') || lowerText.includes('everyone else') || lowerText.includes('other')) {
      return indianContextualResponses.comparison[
        Math.floor(Math.random() * indianContextualResponses.comparison.length)
      ];
    }
    if (lowerText.includes('career') || lowerText.includes('job') || lowerText.includes('guilt')) {
      return indianContextualResponses.careerGuilt[
        Math.floor(Math.random() * indianContextualResponses.careerGuilt.length)
      ];
    }
  }
  
  return indianContextualResponses.default[
    Math.floor(Math.random() * indianContextualResponses.default.length)
  ];
};

