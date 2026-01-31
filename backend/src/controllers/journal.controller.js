// Journal Controller
import journalService from '../services/journal.service.js';
import { sanitizeString, isValidUUID } from '../utils/sanitize.js';

export async function createJournal(req, res) {
    try {
        const { encrypted_payload, allow_ai_memory = false } = req.body;

        if (!encrypted_payload || typeof encrypted_payload !== 'string') {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'encrypted_payload is required and must be a string',
            });
        }

        // Validate payload length (should be substantial if base64 encoded)
        if (encrypted_payload.length < 10) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'encrypted_payload is too short',
            });
        }

        const journal = await journalService.createJournal(
            req.sessionId,
            encrypted_payload,
            Boolean(allow_ai_memory)
        );

        res.json({
            success: true,
            journal: {
                id: journal.id,
                session_id: journal.session_id,
                encrypted_payload: journal.encrypted_payload,
                allow_ai_memory: journal.allow_ai_memory,
                created_at: journal.created_at,
            },
        });
    } catch (error) {
        console.error('Create journal error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create journal entry',
        });
    }
}

export async function listJournals(req, res) {
    try {
        const limit = parseInt(req.query.limit || '50', 10);
        const offset = parseInt(req.query.offset || '0', 10);

        // Validate pagination
        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'limit must be between 1 and 100',
            });
        }

        if (offset < 0) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'offset must be non-negative',
            });
        }

        const result = await journalService.getJournals(req.sessionId, limit, offset);

        res.json({
            success: true,
            journals: result.journals.map(j => ({
                id: j.id,
                session_id: j.session_id,
                encrypted_payload: j.encrypted_payload,
                allow_ai_memory: j.allow_ai_memory,
                created_at: j.created_at,
            })),
            pagination: result.pagination,
        });
    } catch (error) {
        console.error('List journals error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve journals',
        });
    }
}

export async function deleteJournal(req, res) {
    try {
        const { id } = req.params;

        if (!isValidUUID(id)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid journal ID',
            });
        }

        const deleted = await journalService.deleteJournal(id, req.sessionId);

        if (!deleted) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Journal entry not found',
            });
        }

        res.json({
            success: true,
            message: 'Journal entry deleted',
        });
    } catch (error) {
        console.error('Delete journal error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete journal entry',
        });
    }
}
