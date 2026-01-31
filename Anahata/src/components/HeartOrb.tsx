import { motion } from 'framer-motion';
import AnahvaLogo from './AnahvaLogo';

const HeartOrb = () => {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
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
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
      
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/60 to-primary/30 backdrop-blur-sm"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
        style={{
          boxShadow: '0 0 60px hsl(30 45% 55% / 0.4), inset 0 0 40px hsl(30 45% 55% / 0.2)',
        }}
      />
      
      <motion.div
        className="absolute inset-16 md:inset-20 rounded-full bg-gradient-to-br from-gold-light to-primary"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          boxShadow: '0 0 30px hsl(35 50% 70% / 0.6)',
        }}
      />
      
      <div className="absolute z-10">
        <AnahvaLogo size={80} />
      </div>
      
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/60"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI * 2) / 6) * 80, 0],
            y: [0, Math.sin((i * Math.PI * 2) / 6) * 80, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default HeartOrb;
