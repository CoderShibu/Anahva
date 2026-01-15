import { useConfidentialMode } from '@/contexts/ConfidentialModeContext';
import { Switch } from '@/components/ui/switch';
import { Lock, LockOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const ConfidentialModeToggle = () => {
  const { isConfidential, toggleConfidential } = useConfidentialMode();

  return (
    <motion.div
      className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2 flex-1">
        {isConfidential ? (
          <Lock className="w-5 h-5 text-primary" />
        ) : (
          <LockOpen className="w-5 h-5 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium text-foreground">Confidential Mode</p>
          <p className="text-xs text-muted-foreground">
            {isConfidential 
              ? 'No data saved • No memory • No history' 
              : 'All data is saved normally'}
          </p>
        </div>
      </div>
      <Switch
        checked={isConfidential}
        onCheckedChange={toggleConfidential}
      />
    </motion.div>
  );
};

export default ConfidentialModeToggle;

