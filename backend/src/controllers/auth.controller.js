// Authentication Controller
import authService from '../services/auth.service.js';
import { sanitizeString, isValidLanguage } from '../utils/sanitize.js';

export async function demoLogin(req, res) {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Name and password are required',
            });
        }

        const { session, token } = await authService.demoLogin(
            sanitizeString(name, 100),
            sanitizeString(password, 100)
        );

        res.json({
            success: true,
            token,
            session: {
                session_id: session.session_id,
                language: session.language,
                demo: session.demo,
            },
        });
    } catch (error) {
        console.error('Demo login error:', error);
        res.status(401).json({
            error: 'Unauthorized',
            message: error.message || 'Invalid credentials',
        });
    }
}

export async function anonymousLogin(req, res) {
    try {
        const { language = 'EN' } = req.body;

        const validLanguage = isValidLanguage(language) ? language : 'EN';

        const session = await authService.createSession(validLanguage, false);
        const token = authService.generateToken(session.session_id);

        res.json({
            success: true,
            token,
            session: {
                session_id: session.session_id,
                language: session.language,
                demo: session.demo,
            },
        });
    } catch (error) {
        console.error('Anonymous login error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create session',
        });
    }
}

export async function verifySession(req, res) {
    try {
        // Session already attached by auth middleware
        res.json({
            success: true,
            session: {
                session_id: req.session.session_id,
                language: req.session.language,
                demo: req.session.demo,
            },
        });
    } catch (error) {
        console.error('Verify session error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to verify session',
        });
    }
}

export async function logout(req, res) {
    try {
        await authService.deleteSession(req.sessionId);

        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to logout',
        });
    }
}
