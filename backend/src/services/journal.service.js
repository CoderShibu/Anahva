// Journal Service - Database operations
import prisma from '../config/db.js';

class JournalService {
    /**
     * Create a journal entry
     */
    async createJournal(sessionId, encryptedPayload, allowAiMemory = false) {
        const journal = await prisma.journal.create({
            data: {
                session_id: sessionId,
                encrypted_payload: encryptedPayload,
                allow_ai_memory: allowAiMemory,
            },
        });

        return journal;
    }

    /**
     * Get journals for a session
     */
    async getJournals(sessionId, limit = 50, offset = 0) {
        const [journals, total] = await Promise.all([
            prisma.journal.findMany({
                where: {
                    session_id: sessionId,
                    deleted_at: null, // Only non-deleted
                },
                orderBy: {
                    created_at: 'desc',
                },
                take: limit,
                skip: offset,
            }),
            prisma.journal.count({
                where: {
                    session_id: sessionId,
                    deleted_at: null,
                },
            }),
        ]);

        return {
            journals,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        };
    }

    /**
     * Get a single journal by ID
     */
    async getJournalById(journalId, sessionId) {
        const journal = await prisma.journal.findFirst({
            where: {
                id: journalId,
                session_id: sessionId,
                deleted_at: null,
            },
        });

        return journal;
    }

    /**
     * Delete a journal (soft delete)
     */
    async deleteJournal(journalId, sessionId) {
        const journal = await prisma.journal.updateMany({
            where: {
                id: journalId,
                session_id: sessionId,
            },
            data: {
                deleted_at: new Date(),
            },
        });

        return journal.count > 0;
    }

    /**
     * Hard delete a journal (permanent)
     */
    async hardDeleteJournal(journalId, sessionId) {
        const journal = await prisma.journal.deleteMany({
            where: {
                id: journalId,
                session_id: sessionId,
            },
        });

        return journal.count > 0;
    }
}

export default new JournalService();
