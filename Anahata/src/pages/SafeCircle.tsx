import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import SafeNote from '@/components/SafeNote';
import SafeSignal from '@/components/SafeSignal';
import StressModeSelector from '@/components/StressModeSelector';
import { Wind, Users, Phone, Shield, Heart } from 'lucide-react';

const SafeCircle = () => {
  const { t } = useLanguage();

  const tiers = [
    {
      icon: Wind,
      title: t('groundingExercise'),
      description: 'AI-guided breathing and grounding techniques',
      tier: 1,
      action: 'Begin grounding',
    },
    {
      icon: Users,
      title: t('anonymousPeer'),
      description: 'Connect anonymously with a trained peer supporter',
      tier: 2,
      action: 'Find a peer',
    },
    {
      icon: Phone,
      title: t('alertContact'),
      description: 'Notify your trusted contact with one tap',
      tier: 3,
      action: 'Alert now',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-2xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display text-foreground mb-2">
            {t('safeCircleTitle')}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('safeCircleDesc')}
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-32 h-32">
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/10"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-4 rounded-full bg-primary/20"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
            <motion.div
              className="absolute inset-8 rounded-full bg-primary/40 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.4,
              }}
            >
              <Heart className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.title}
              className="card-3d p-6 group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <tier.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      Tier {tier.tier}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                    {tier.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tier.description}
                  </p>
                  <motion.button
                    className="mt-4 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.action}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SafeNote />
          <SafeSignal />
          <StressModeSelector />
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-muted-foreground">
            🔒 Your privacy is sacred. All connections are confidential.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default SafeCircle;
