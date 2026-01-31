// Express App Configuration
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import config from './config/env.js';
import securityConfig from './config/security.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import journalRoutes from './routes/journal.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

// Security middleware
app.use(helmet(securityConfig.helmet));
app.use(cors(securityConfig.cors));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// HTTP logging (only in development)
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'anahata-backend',
        environment: config.nodeEnv,
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
