import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import AnahvaLogo from '@/components/AnahvaLogo';
import { ChevronDown, HelpCircle, Mail, Shield, Lock, Globe, Smartphone, Heart } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is Anahva?",
      answer: "Anahva is an India-first, AI-enabled digital journaling and mental wellness support platform. The application is designed to assist users in structured self-reflection, emotional awareness, and guided journaling through a secure and privacy-centric interface. Anahva functions as a supportive digital tool and does not provide medical, psychological, or psychiatric diagnosis or treatment.",
      icon: <Heart className="w-5 h-5" />
    },
    {
      question: "Is Anahva a medical or therapeutic service?",
      answer: "No. Anahva is not a medical device, not a clinical service, and not a substitute for professional mental health care. The platform is intended for self-reflection and emotional support only. Users experiencing severe distress are advised to seek assistance from qualified healthcare professionals or emergency services.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "Who is the intended audience for Anahva?",
      answer: "Anahva is intended for: Students, Young adults, Working professionals, and Individuals seeking a private and structured space for emotional reflection. The platform is designed to be inclusive and accessible across age groups and devices.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "How does Anahva ensure data privacy and security?",
      answer: "Data protection and user confidentiality are core principles of Anahva. Key measures include: Secure data storage and encryption, User-controlled data access and memory permissions, No sale or commercial sharing of user data, and Support for anonymous usage. All data handling practices are aligned with applicable data protection standards.",
      icon: <Lock className="w-5 h-5" />
    },
    {
      question: "Does Anahva store or analyze user content?",
      answer: "User content is processed only to provide requested functionality, such as journaling support or reflective prompts. Users have full control over: What data is stored, What content the AI is allowed to reference, and When data can be deleted or restricted. No content is used for advertising or profiling.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "Does Anahva support multiple languages?",
      answer: "Yes. Anahva currently supports: English and Hindi. Language preferences can be changed at any time through the application settings.",
      icon: <Globe className="w-5 h-5" />
    },
    {
      question: "Is user registration mandatory?",
      answer: "No. Anahva allows anonymous access, enabling users to utilize core features without mandatory account creation.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "What should users do in case of emotional distress or crisis?",
      answer: "Anahva includes safety-oriented features that provide: Grounding and calming exercises, Guidance to seek external support, and Options to contact trusted individuals. In cases of immediate risk, users are advised to contact local emergency services or qualified mental health professionals.",
      icon: <Heart className="w-5 h-5" />
    },
    {
      question: "Is Anahva accessible across different devices?",
      answer: "Yes. Anahva is designed to function seamlessly across: Mobile phones, Tablets, Laptops, and Desktop systems. The interface complies with accessibility and usability best practices.",
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      question: "Is Anahva free to use?",
      answer: "Core functionalities of Anahva are available without charge. Any future enhancements or optional services, if introduced, will be communicated transparently.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "Who developed Anahva?",
      answer: "Anahva is developed by Shibasish, with a focus on responsible AI usage, privacy-first design, and public trust.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "How can users contact the development team?",
      answer: "For feedback, queries, or official communication, users may contact: Email: 📧 shibasish2005@gmail.com. All communications are reviewed in accordance with established protocols.",
      icon: <Mail className="w-5 h-5" />
    },
    {
      question: "Is Anahva compliant with ethical AI principles?",
      answer: "Yes. Anahva is developed in alignment with: Ethical AI usage, Human-in-the-loop safeguards, Transparency and accountability principles, and Non-directive, non-diagnostic AI behavior. The system is designed to prioritize user safety and public trust.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "Will Anahva continue to evolve?",
      answer: "Yes. Anahva is subject to continuous evaluation and improvement to ensure reliability, accessibility, and responsible innovation.",
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AnahvaLogo size={48} />
            <h1 className="text-4xl md:text-5xl font-display text-primary">Frequently Asked Questions</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about Anahva
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="card-3d overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-primary mt-1 flex-shrink-0">
                    {faq.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground pr-4">
                      {index + 1}. {faq.question}
                    </h3>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="pt-4 border-t border-border">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 card-3d p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-foreground mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:shibasish2005@gmail.com"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Mail className="w-5 h-5" />
            Contact us at shibasish2005@gmail.com
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default FAQ;

