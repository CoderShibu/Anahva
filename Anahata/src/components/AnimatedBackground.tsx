import { motion } from 'framer-motion';
import { useMemo } from 'react';

const AnimatedBackground = () => {
  const floatingElements = useMemo(() => {
    const seeds = [0.1, 0.3, 0.5, 0.7, 0.2, 0.4, 0.6, 0.8];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: seeds[i] * 40 + 20,
      x: seeds[i] * 100,
      y: (seeds[(i + 1) % 8]) * 100,
      duration: seeds[i] * 20 + 15,
      delay: seeds[i] * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40 perspective-1000">
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute opacity-10"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id={`bgGradient${element.id}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFA500" stopOpacity="0.1" />
              </radialGradient>
            </defs>
            <g transform="translate(100, 100)">
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].slice(0, 6).map((angle) => (
                <path
                  key={angle}
                  d="M 0,-30 L 2,-35 L 0,-40 L -2,-35 Z"
                  fill={`url(#bgGradient${element.id})`}
                  stroke="#FFD700"
                  strokeWidth="0.5"
                  opacity="0.4"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle
                cx="0"
                cy="0"
                r="25"
                fill="none"
                stroke="#FFD700"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <path
                d="M 0,-15 L 12,-5 L 7,12 L -7,12 L -12,-5 Z"
                fill={`url(#bgGradient${element.id})`}
                stroke="#FFD700"
                strokeWidth="1"
                opacity="0.4"
              />
              <path
                d="M 0,15 L -12,5 L -7,-12 L 7,-12 L 12,5 Z"
                fill={`url(#bgGradient${element.id})`}
                stroke="#FFD700"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>
          </svg>
        </motion.div>
      ))}
      
      <motion.div
        className="absolute left-[-8rem] top-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-primary/30 via-gold-light/20 to-transparent blur-3xl"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: [15, -10, 15],
          rotateY: [-15, 10, -15],
          translateZ: [0, 60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute right-[-10rem] bottom-0 w-80 h-80 rounded-full bg-gradient-to-tl from-gold-light/25 via-primary/20 to-transparent blur-3xl"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: [-10, 15, -10],
          rotateY: [10, -15, 10],
          translateZ: [0, 80, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;

