import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PromptCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  onClick?: () => void;
  delay?: number;
}

const PromptCard = ({ icon: Icon, title, description, onClick, delay = 0 }: PromptCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="card-3d p-5 text-left w-full group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-lg text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
};

export default PromptCard;
