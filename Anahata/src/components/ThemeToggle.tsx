import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-1 bg-secondary rounded-full">
      <motion.div
        className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 bg-primary text-primary-foreground"
        whileTap={{ scale: 0.95 }}
        aria-label="Dark theme (only available theme)"
      >
        <Moon className="w-4 h-4" />
        <span>Dark</span>
      </motion.div>
    </div>
  );
};

export default ThemeToggle;

