import rateLimit from 'express-rate-limit';
import config from '../config/env.js';
import { securityConfig } from '../config/security.js';

/**
 * Rate Limiting Middleware
 * Uses default memory store (Redis removed for simplicity)
 */
export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || securityConfig.rateLimit.windowMs,
    max: max || securityConfig.rateLimit.max,
    message: message || securityConfig.rateLimit.message,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    },
    keyGenerator: (req) => {
      // Use session ID if available, otherwise IP
      return req.session?.session_id || req.ip || 'unknown';
    },
  });
};

// Default rate limiter
export const defaultRateLimiter = createRateLimiter();

// Stricter rate limiter for auth endpoints
export const authRateLimiter = createRateLimiter(900000, 10, 'Too many login attempts. Please try again later.');

// Very strict rate limiter for sensitive operations
export const strictRateLimiter = createRateLimiter(3600000, 5, 'Too many requests. Please try again later.');

