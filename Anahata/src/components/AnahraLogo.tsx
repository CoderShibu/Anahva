import { motion } from 'framer-motion';

const AnahvaLogo = ({ size = 120, className = '' }: { size?: number; className?: string }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="goldGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFA500" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      
      <g transform="translate(100, 100)">
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle) => (
            <path
              key={angle}
              d="M 0,-75 L 5,-85 L 0,-95 L -5,-85 Z"
              fill="url(#goldGradient)"
              stroke="#000"
              strokeWidth="1.5"
              transform={`rotate(${angle})`}
            />
          ))}
        </motion.g>
        
        <circle
          cx="0"
          cy="0"
          r="65"
          fill="none"
          stroke="#000"
          strokeWidth="1"
        />
        
        <circle
          cx="0"
          cy="0"
          r="60"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
        />
        
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 62.5;
          const y = Math.sin(rad) * 62.5;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="url(#goldGradient)"
            />
          );
        })}
        
        <circle
          cx="0"
          cy="0"
          r="55"
          fill="none"
          stroke="#000"
          strokeWidth="1"
        />
        
        <g>
          <path
            d="M 0,-35 L 30,-10 L 18,25 L -18,25 L -30,-10 Z"
            fill="url(#goldGradient)"
            stroke="#000"
            strokeWidth="2.5"
          />
          <path
            d="M 0,35 L -30,10 L -18,-25 L 18,-25 L 30,10 Z"
            fill="url(#goldGradient)"
            stroke="#000"
            strokeWidth="2.5"
          />
          
          <text
            x="0"
            y="8"
            fontSize="32"
            fill="#FFD700"
            stroke="#000"
            strokeWidth="1"
            textAnchor="middle"
            fontFamily="serif"
            fontWeight="bold"
            style={{ 
              paintOrder: 'stroke fill',
              filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.8))'
            }}
          >
            यं
          </text>
          
          <circle
            cx="0"
            cy="-15"
            r="3"
            fill="url(#goldGradient)"
          />
        </g>
      </g>
    </svg>
  );
};

export default AnahvaLogo;
