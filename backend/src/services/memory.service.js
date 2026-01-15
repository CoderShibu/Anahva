import prisma from '../config/db.js';
import aiService from './ai.service.js';

/**
 * Memory Service
 * Manages AI memory using embeddings only
 * Never stores raw text
 */
class MemoryService {
  /**
   * Create memory embedding from text
   * @param {string} text - Text to create embedding for
   * @returns {Promise<Array>} Embedding vector
   */
  async createEmbedding(text) {
    // In production, use OpenAI embeddings or similar
    // For now, return a placeholder structure
    // This should be replaced with actual embedding generation
    if (!text || text.length === 0) {
      return null;
    }

    // Placeholder: In production, call OpenAI embeddings API
    // const response = await openai.embeddings.create({
    //   model: 'text-embedding-3-small',
    //   input: text,
    // });
    // return response.data[0].embedding;

    // For now, return a simple hash-based representation
    // This is NOT a real embedding, just a placeholder
    return Array.from({ length: 1536 }, (_, i) => Math.random() * 0.1 - 0.05);
  }

  /**
   * Store memory (embedding only)
   * @param {string} sessionId - Session ID
   * @param {string} text - Text to remember (will be converted to embedding)
   * @param {string} memoryType - Type of memory (journal, chat, insight)
   * @returns {Promise<Object>} Created memory
   */
  async storeMemory(sessionId, text, memoryType = 'chat') {
    if (!sessionId || !text) {
      throw new Error('Session ID and text are required');
    }

    const embedding = await this.createEmbedding(text);
    if (!embedding) {
      throw new Error('Failed to create embedding');
    }

    // Set expiry to 90 days of inactivity
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    // Convert embedding array to JSON string for storage
    const embeddingVector = JSON.stringify(embedding);

    const memory = await prisma.memory.create({
      data: {
        session_id: sessionId,
        embedding_vector: embeddingVector,
        memory_type: memoryType,
        expires_at: expiresAt,
      },
    });

    return memory;
  }

  /**
   * Get relevant memories for context
   * @param {string} sessionId - Session ID
   * @param {string} queryText - Query text to find similar memories
   * @param {number} limit - Maximum number of memories to return
   * @returns {Promise<Array>} Relevant memories
   */
  async getRelevantMemories(sessionId, queryText, limit = 5) {
    if (!sessionId || !queryText) {
      return [];
    }

    // Get all active memories for session
    const memories = await prisma.memory.findMany({
      where: {
        session_id: sessionId,
        expires_at: {
          gt: new Date(),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit * 2, // Get more for similarity filtering
    });

    // In production, use cosine similarity or vector search
    // For now, return recent memories
    return memories.slice(0, limit);
  }

  /**
   * Delete all memories for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<number>} Number of deleted memories
   */
  async forgetMemories(sessionId) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const result = await prisma.memory.deleteMany({
      where: {
        session_id: sessionId,
      },
    });

    return result.count;
  }

  /**
   * Clean up expired memories
   * @returns {Promise<number>} Number of deleted memories
   */
  async cleanupExpiredMemories() {
    const result = await prisma.memory.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}

const memoryService = new MemoryService();

export default memoryService;

