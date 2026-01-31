import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BookOpen, MessageCircle, Trash2, Calendar, Clock } from 'lucide-react';
import { journalAPI, chatHistoryAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
}

interface ChatMessage {
  text: string;
  isAI: boolean;
  timestamp: string;
}

const History = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'journals' | 'chats'>('journals');
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load journals from backend
      try {
        const journalResponse = await journalAPI.list(100, 0);
        if (journalResponse.success && journalResponse.journals) {
          const decodedJournals = journalResponse.journals.map((j: any) => {
            try {
              const decoded = JSON.parse(atob(j.encrypted_payload));
              return {
                id: j.id,
                content: decoded.content || '',
                created_at: j.created_at,
              };
            } catch {
              return {
                id: j.id,
                content: 'Unable to decode entry',
                created_at: j.created_at,
              };
            }
          });
          setJournals(decodedJournals);
        } else {
          setJournals([]);
        }
      } catch (backendError) {
        console.warn('Backend journal load failed, using empty list:', backendError);
        setJournals([]);
      }

      // Load chat history from localStorage
      const chatHistory = chatHistoryAPI.getHistory();
      setChats(chatHistory);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    try {
      const result = await journalAPI.delete(id);
      if (result.success) {
        setJournals(journals.filter(j => j.id !== id));
        toast({
          title: 'Deleted',
          description: 'Journal entry deleted',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete journal entry',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to delete journal:', error);
      // Optimistic delete for offline mode
      setJournals(journals.filter(j => j.id !== id));
      toast({
        title: 'Deleted',
        description: 'Journal entry removed (offline mode)',
      });
    }
  };

  const handleClearChats = () => {
    chatHistoryAPI.clearHistory();
    setChats([]);
    toast({
      title: 'Cleared',
      description: 'Chat history cleared',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display text-foreground mb-2">
            {t('history')}
          </h1>
          <p className="text-muted-foreground">
            {t('viewHistory')}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <motion.button
            onClick={() => setActiveTab('journals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'journals'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('journals')}</span>
            <span className="text-xs opacity-75">({journals.length})</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'chats'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('chats')}</span>
            <span className="text-xs opacity-75">({chats.length})</span>
          </motion.button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'journals' ? (
              <motion.div
                key="journals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {journals.length === 0 ? (
                  <div className="card-3d p-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('noJournals')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <motion.button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete ALL journals?')) {
                            setLoading(true);
                            try {
                              await journalAPI.clear();
                              setJournals([]);
                              toast({ title: 'Cleared', description: 'All journals deleted' });
                            } catch (e) {
                              toast({ title: 'Error', description: 'Failed to clear journals', variant: 'destructive' });
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Journals</span>
                      </motion.button>
                    </div>
                    {journals.map((journal, index) => (
                      <motion.div
                        key={journal.id}
                        className="card-3d p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(journal.created_at)}</span>
                          </div>
                          <motion.button
                            onClick={() => handleDeleteJournal(journal.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {journal.content}
                        </p>
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="chats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {chats.length === 0 ? (
                  <div className="card-3d p-12 text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('noChats')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <motion.button
                        onClick={handleClearChats}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t('clearChats')}</span>
                      </motion.button>
                    </div>
                    {chats.map((chat, index) => (
                      <motion.div
                        key={index}
                        className={`flex ${chat.isAI ? 'justify-start' : 'justify-end'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div
                          className={`max-w-[85%] card-3d p-4 ${chat.isAI ? 'chat-bubble-ai' : 'bg-primary/20'
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(chat.timestamp)}</span>
                          </div>
                          <p className="text-foreground leading-relaxed">{chat.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default History;

