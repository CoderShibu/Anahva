import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { securityConfig } from './config/security.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import journalRoutes from './routes/journal.routes.js';
import chatRoutes from './routes/chat.routes.js';
import insightRoutes from './routes/insight.routes.js';
import safetyRoutes from './routes/safety.routes.js';
import settingsRoutes from './routes/settings.routes.js';

const app = express();

// Security middleware
app.use(helmet(securityConfig.helmet));
app.use(cors(securityConfig.cors));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'anahva-backend',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Anahva Backend API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      journal: '/api/journal',
      chat: '/api/chat',
      insights: '/api/insights',
      safety: '/api/safety',
      settings: '/api/settings',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/settings', settingsRoutes);

// Language endpoint (public, for frontend)
app.get('/api/language/keys', (req, res) => {
  // Return language keys for EN and HI
  // In production, this could be loaded from files or database
  res.json({
    success: true,
    languages: {
      EN: {
        welcome: 'Welcome to Anahva',
        yourSanctuary: 'Your mental wellness sanctuary',
        // Add more keys as needed
      },
      HI: {
        welcome: 'अनाहत में आपका स्वागत है',
        yourSanctuary: 'आपका मानसिक कल्याण आश्रय',
        // Add more keys as needed
      },
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;

