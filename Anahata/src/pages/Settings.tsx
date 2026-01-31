import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Globe, Eye, Shield, Phone, LogOut, Lock, ChevronRight } from 'lucide-react';

const Settings = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { reducedMotion, setReducedMotion } = useAccessibility();
  const navigate = useNavigate();
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const settingsGroups: Array<{
    title: string;
    items: Array<{
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      action: React.ReactNode;
      onClick?: () => void;
    }>;
  }> = [
      {
        title: t('language'),
        items: [
          {
            icon: Globe,
            label: t('language'),
            action: <LanguageToggle />,
          },
        ],
      },
      {
        title: t('accessibility'),
        items: [
          {
            icon: Eye,
            label: t('reducedMotion'),
            action: (
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            ),
          },
        ],
      },
      {
        title: t('dataPrivacy'),
        items: [
          {
            icon: Lock,
            label: t('encryptedDevice'),
            action: <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Active</span>,
          },
          {
            icon: Shield,
            label: 'Privacy Policy',
            action: <ChevronRight className="w-4 h-4 text-muted-foreground" />,
            onClick: () => setPrivacyDialogOpen(true),
          },
        ],
      },
      {
        title: t('emergencyContact'),
        items: [
          {
            icon: Phone,
            label: 'Add Trusted Contact',
            action: <ChevronRight className="w-4 h-4 text-muted-foreground" />,
          },
        ],
      },
    ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-2xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display text-foreground">
            {t('settings')}
          </h1>
        </motion.div>

        <motion.div
          className="card-3d p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-display text-primary">
                {user?.name?.[0] || 'A'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-display text-foreground">{user?.name}</h2>
              {/* Demo mode indicator removed */}
            </div>
          </div>
        </motion.div>

        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + groupIndex * 0.1 }}
          >
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              {group.title}
            </h3>
            <div className="card-3d divide-y divide-border overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={item.onClick}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{item.label}</span>
                  </div>
                  {item.action}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.button
          onClick={handleLogout}
          className="w-full card-3d p-4 flex items-center justify-center gap-3 text-destructive hover:bg-destructive/10 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <LogOut className="w-5 h-5" />
          <span>{t('logout')}</span>
        </motion.button>

        <motion.p
          className="text-center text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Anahva v1.0.0
        </motion.p>
      </main>

      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Privacy Policy</DialogTitle>
            <DialogDescription>
              Your privacy is sacred. Here's how we protect it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-foreground">
            <div>
              <h3 className="font-semibold mb-2">Data Encryption</h3>
              <p className="text-muted-foreground">
                All your data is encrypted on your device. We never see your journal entries, chat conversations, or personal information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Data Collection</h3>
              <p className="text-muted-foreground">
                We don't collect, store, or sell your personal data. Your thoughts remain yours alone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Confidential Mode</h3>
              <p className="text-muted-foreground">
                When enabled, no data is saved, no memory is stored, and no history is shown. Perfect for when you need absolute privacy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Anonymous by Default</h3>
              <p className="text-muted-foreground">
                You can use Anahva without creating an account. All features work anonymously.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Ads, No Tracking</h3>
              <p className="text-muted-foreground">
                We don't show ads or track your usage. This is a safe space, free from commercial interests.
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
