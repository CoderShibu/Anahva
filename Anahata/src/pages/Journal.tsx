import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfidentialMode } from '@/contexts/ConfidentialModeContext';
import Navigation from '@/components/Navigation';
import { Save, Mic, Sparkles, ChevronRight, Lock, Check } from 'lucide-react';
import { journalAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const Journal = () => {
  const { t } = useLanguage();
  const { isConfidential } = useConfidentialMode();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [showPrompts, setShowPrompts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (isConfidential) {
      setContent('');
    }
  }, [isConfidential]);

  // Auto-save with debounce
  const saveJournal = useCallback(async (text: string) => {
    if (isConfidential || !text.trim()) return;

    setIsSaving(true);
    try {
      await journalAPI.create(text, false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save journal:', error);
      toast({
        title: 'Error',
        description: 'Failed to save journal entry',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [isConfidential, toast]);

  // Debounced save
  useEffect(() => {
    if (isConfidential || !content.trim()) return;

    const timer = setTimeout(() => {
      saveJournal(content);
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, isConfidential, saveJournal]);

  const prompts = [
    { id: 1, text: t('journalPrompt1') },
    { id: 2, text: t('journalPrompt2') },
    { id: 3, text: t('journalPrompt3') },
  ];

  const handlePromptClick = (promptText: string) => {
    setContent(promptText + '\n\n');
    setShowPrompts(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-2xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-display text-foreground">
              {t('journal')}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: content.length > 0 ? 1 : 0 }}
          >
            {isConfidential ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Confidential Mode</span>
              </>
            ) : isSaving ? (
              <>
                <Save className="w-4 h-4 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="w-4 h-4 text-primary" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('savedAutomatically')}
              </>
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showPrompts && !content && (
            <motion.div
              className="mb-6 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {t('journalPrompt')}
              </p>
              {prompts.map((prompt, index) => (
                <motion.button
                  key={prompt.id}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="card-3d w-full p-4 text-left flex items-center justify-between group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {prompt.text}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('journalPlaceholder')}
            className={`w-full min-h-[300px] p-6 rounded-2xl bg-card border border-border/50 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all ${isConfidential ? 'font-mono' : ''}`}
            spellCheck={false}
          />
          <div className="absolute bottom-4 right-4">
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default Journal;
