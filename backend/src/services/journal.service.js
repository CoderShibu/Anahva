import prisma from '../config/db.js';
import encryptionService from './encryption.service.js';
import memoryService from './memory.service.js';

/**
 * Journal Service
 * Handles journal entries with encrypted storage
 * NEVER stores plaintext
 */
class JournalService {
  /**
   * Create journal entry
   * @param {string} sessionId - Session ID
   * @param {string} encryptedPayload - Already encrypted journal content (from client)
   * @param {boolean} allowAiMemory - Whether to allow AI memory
   * @returns {Promise<Object>} Created journal entry
   */
  async createJournal(sessionId, encryptedPayload, allowAiMemory = false) {
    if (!sessionId || !encryptedPayload) {
      throw new Error('Session ID and encrypted payload are required');
    }

    // Validate that payload is encrypted (basic check - must be valid base64)
    if (!encryptedPayload || encryptedPayload.length < 10) {
      throw new Error('Invalid encrypted payload format');
    }

    // Verify it's base64 encoded
    try {
      Buffer.from(encryptedPayload, 'base64');
    } catch (error) {
      throw new Error('Encrypted payload must be valid base64');
    }

    const journal = await prisma.journal.create({
      data: {
        session_id: sessionId,
        encrypted_payload: encryptedPayload,
        allow_ai_memory: allowAiMemory,
      },
    });

    // If AI memory is allowed, create memory embedding
    // Note: We would need to decrypt temporarily to create embedding
    // This requires explicit user consent
    if (allowAiMemory) {
      try {
        // Decrypt only for embedding creation (with consent)
        const decrypted = encryptionService.decrypt(encryptedPayload);
        // Create embedding (doesn't store raw text)
        await memoryService.storeMemory(sessionId, decrypted, 'journal');
      } catch (error) {
        // Log error but don't fail journal creation
        console.error('Failed to create memory for journal:', error.message);
      }
    }

    return {
      id: journal.id,
      created_at: journal.created_at,
      allow_ai_memory: journal.allow_ai_memory,
    };
  }

  /**
   * Get journal entries for a session
   * @param {string} sessionId - Session ID
   * @param {number} limit - Maximum number of entries
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} Journal entries (encrypted payloads only)
   */
  async getJournals(sessionId, limit = 50, offset = 0) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const journals = await prisma.journal.findMany({
      where: {
        session_id: sessionId,
        deleted_at: null,
      },
      select: {
        id: true,
        encrypted_payload: true,
        created_at: true,
        updated_at: true,
        allow_ai_memory: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return journals;
  }

  /**
   * Delete journal entry (hard delete)
   * @param {string} sessionId - Session ID
   * @param {string} journalId - Journal ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteJournal(sessionId, journalId) {
    if (!sessionId || !journalId) {
      throw new Error('Session ID and journal ID are required');
    }

    // Verify ownership
    const journal = await prisma.journal.findFirst({
      where: {
        id: journalId,
        session_id: sessionId,
      },
    });

    if (!journal) {
      throw new Error('Journal entry not found or access denied');
    }

    // Hard delete
    await prisma.journal.delete({
      where: {
        id: journalId,
      },
    });

    return true;
  }

  /**
   * Get journal count for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<number>} Journal count
   */
  async getJournalCount(sessionId) {
    if (!sessionId) {
      return 0;
    }

    const count = await prisma.journal.count({
      where: {
        session_id: sessionId,
        deleted_at: null,
      },
    });

    return count;
  }
}

const journalService = new JournalService();

export default journalService;

