import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, BookOpen, MessageCircle, BarChart3, Shield, Settings, Info, HelpCircle, History } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnahvaLogo from './AnahvaLogo';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/home', icon: Home, label: t('home') },
    { to: '/journal', icon: BookOpen, label: t('journal') },
    { to: '/chat', icon: MessageCircle, label: t('chat') },
    { to: '/insights', icon: BarChart3, label: t('insights') },
    { to: '/history', icon: History, label: t('history') },
    { to: '/safe-circle', icon: Shield, label: t('safeCircle') },
  ];

  return (
    <>
      {/* Mobile: Settings button top-left, opens sheet with Settings, FAQ, About */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl bg-charcoal-deep/95 backdrop-blur-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Settings & more"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 bg-charcoal-deep/95 border-r border-border md:hidden">
          <SheetHeader>
            <SheetTitle className="text-left font-display text-primary">{t('settings')}</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-2">
            <NavLink
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === '/settings'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">{t('settings')}</span>
            </NavLink>
            <NavLink
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === '/faq'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">FAQ</span>
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === '/about'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">About</span>
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal-deep/95 backdrop-blur-lg border-t border-border md:hidden">
        <div className="flex justify-around items-center py-2 px-2 safe-area-bottom">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-1 py-2 px-3 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 transition-colors relative z-10 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-xs transition-colors relative z-10 ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-charcoal-deep/50 backdrop-blur-lg border-r border-border flex-col z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <AnahvaLogo size={32} />
            <h1 className="text-2xl font-display text-primary">Anahva</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t('yourSanctuary')}
          </p>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebar"
                        className="absolute inset-0 bg-primary/10 rounded-xl border-l-2 border-primary"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                    <item.icon className="w-5 h-5 relative z-10" />
                    <span className="font-medium relative z-10">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <NavLink
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === '/settings'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">{t('settings')}</span>
          </NavLink>
          <NavLink
            to="/about"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === '/about'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="font-medium">About</span>
          </NavLink>
          <NavLink
            to="/faq"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === '/faq'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">FAQ</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
