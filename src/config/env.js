import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ENCRYPTION_KEY'
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  
  // OpenAI (Optional)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || null,
  
  // Google API (Optional)
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || null,
  
  // Demo Mode
  DEMO_MODE_ENABLED: process.env.NODE_ENV !== 'production' && process.env.DEMO_MODE_ENABLED === 'true',
  DEMO_USERNAME: process.env.DEMO_USERNAME || 'Shibasish',
  DEMO_PASSWORD: process.env.DEMO_PASSWORD || 'Shibasish',
  
  // Security
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  SESSION_TIMEOUT_MS: parseInt(process.env.SESSION_TIMEOUT_MS || '604800000', 10), // 7 days
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_DIR: process.env.LOG_DIR || './logs',
};

