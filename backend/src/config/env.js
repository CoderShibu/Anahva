// Environment configuration loader
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// Validate required environment variables
const required = ['DATABASE_URL', 'JWT_SECRET', 'ENCRYPTION_KEY'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file');
    process.exit(1);
}

// Export configuration
export default {
    // Database
    databaseUrl: process.env.DATABASE_URL,

    // Security
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,

    // AI
    googleApiKey: process.env.GOOGLE_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,

    // Server
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),

    // Demo mode
    demoModeEnabled: process.env.DEMO_MODE_ENABLED === 'true',
    demoUsername: process.env.DEMO_USERNAME || 'Shibasish',
    demoPassword: process.env.DEMO_PASSWORD || 'Shibasish',

    // Rate limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

    // Session
    sessionTimeoutMs: parseInt(process.env.SESSION_TIMEOUT_MS || '604800000', 10), // 7 days

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
    logDir: process.env.LOG_DIR || './logs',

    // Redis (optional)
    redisUrl: process.env.REDIS_URL,
};
