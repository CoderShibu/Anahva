// Authentication Service
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/db.js';
import config from '../config/env.js';

class AuthService {
    /**
     * Create a new session
     */
    async createSession(language = 'EN', demo = false) {
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + config.sessionTimeoutMs);

        const session = await prisma.session.create({
            data: {
                session_id: sessionId,
                language,
                demo,
                expires_at: expiresAt,
            },
        });

        return session;
    }

    /**
     * Generate JWT token
     */
    generateToken(sessionId) {
        return jwt.sign(
            { sessionId },
            config.jwtSecret,
            { expiresIn: '7d' }
        );
    }

    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, config.jwtSecret);
        } catch (error) {
            return null;
        }
    }

    /**
     * Get session by session_id
     */
    async getSession(sessionId) {
        const session = await prisma.session.findUnique({
            where: { session_id: sessionId },
        });

        // Check if expired
        if (session && new Date() > new Date(session.expires_at)) {
            return null;
        }

        return session;
    }

    /**
     * Update session last active time
     */
    async updateSessionActivity(sessionId) {
        await prisma.session.update({
            where: { session_id: sessionId },
            data: { last_active: new Date() },
        });
    }

    /**
     * Demo login (development only)
     */
    async demoLogin(username, password) {
        if (!config.demoModeEnabled) {
            throw new Error('Demo mode is disabled');
        }

        if (username !== config.demoUsername || password !== config.demoPassword) {
            throw new Error('Invalid credentials');
        }

        // Create demo session
        const session = await this.createSession('EN', true);
        const token = this.generateToken(session.session_id);

        return { session, token };
    }

    /**
     * Delete session (logout)
     */
    async deleteSession(sessionId) {
        await prisma.session.delete({
            where: { session_id: sessionId },
        });
    }
}

export default new AuthService();
