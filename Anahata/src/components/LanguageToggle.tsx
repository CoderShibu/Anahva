import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'हि', name: 'Hindi' },
    { code: 'ta', label: 'த', name: 'Tamil' },
    { code: 'te', label: 'తె', name: 'Telugu' },
    { code: 'kn', label: 'ಕ', name: 'Kannada' },
    { code: 'bn', label: 'ব', name: 'Bengali' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-full flex-wrap">
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => setLanguage(lang.code as any)}
          className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
            language === lang.code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          whileTap={{ scale: 0.95 }}
          title={lang.name}
        >
          {lang.label}
        </motion.button>
      ))}
    </div>
  );
};

export default LanguageToggle;
