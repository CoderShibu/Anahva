import config from './env.js';

export const securityConfig = {
  // CORS configuration
  cors: {
    origin: config.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || []
      : true, // Allow all in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  
  // Helmet security headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // JWT
  jwt: {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  },
  
  // Session
  session: {
    timeout: config.SESSION_TIMEOUT_MS,
    refreshThreshold: 3600000, // 1 hour
  },
  
  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
  },
};

