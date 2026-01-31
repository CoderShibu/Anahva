import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNightWatch } from '@/contexts/NightWatchContext';
import HeartOrb from '@/components/HeartOrb';
import PromptCard from '@/components/PromptCard';
import Navigation from '@/components/Navigation';
import ConfidentialModeToggle from '@/components/ConfidentialModeToggle';
import TrustBadges from '@/components/TrustBadges';
import AnahvaLogo from '@/components/AnahvaLogo';
import { Pencil, MessageCircle, Wind, Mic, Sparkles, Moon } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isNightMode } = useNightWatch();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = t('greetingMorning');
    else if (hour < 17) greeting = t('greetingAfternoon');
    else greeting = t('greetingEvening');
    
    return greeting.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64 relative overflow-hidden">
      <div className="absolute inset-0 bg-mandala opacity-25" />
      <Navigation />
      
      <main className="relative max-w-2xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AnahvaLogo size={40} />
            <h1 className="text-3xl md:text-4xl font-display text-primary">Anahva</h1>
          </div>
          <h2 className="text-4xl md:text-6xl font-display text-foreground mb-3">
            {getGreeting()}, <span className="text-primary">{user?.name}</span>
          </h2>
          <p className="text-muted-foreground">
            {t('howFeeling')}
          </p>
        </motion.div>

        {isNightMode && (
          <motion.div
            className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Moon className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Night-Watch Mode Active</p>
              <p className="text-xs text-muted-foreground">Slower pace, softer glow, gentle listening</p>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <HeartOrb />
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <ConfidentialModeToggle />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.button
            onClick={() => navigate('/journal')}
            className="btn-gold flex items-center justify-center gap-3 py-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Pencil className="w-5 h-5" />
            <span className="font-display text-lg">{t('writeFromHeart')}</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/chat')}
            className="card-3d flex items-center justify-center gap-3 py-5 border border-primary/30 hover:border-primary/60 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-display text-lg text-primary">{t('talkToAnahva')}</span>
          </motion.button>
        </div>

        <motion.h2 
          className="text-base md:text-lg uppercase tracking-wider text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t('yourSanctuary')}
        </motion.h2>

        <div className="space-y-3">
          <PromptCard
            icon={Wind}
            title={t('twoMinGrounding')}
            description="Breathe and center yourself"
            onClick={() => navigate('/safe-circle')}
            delay={0.6}
          />
          <PromptCard
            icon={Mic}
            title={t('voiceJournal')}
            description="Speak your thoughts freely"
            onClick={() => navigate('/journal')}
            delay={0.7}
          />
          <PromptCard
            icon={Sparkles}
            title={t('gentleReflection')}
            description="Explore your inner world"
            onClick={() => navigate('/insights')}
            delay={0.8}
          />
        </div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <TrustBadges />
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
