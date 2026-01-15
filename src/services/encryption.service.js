import crypto from 'crypto';
import config from '../config/env.js';

/**
 * Encryption Service
 * Handles encryption/decryption of sensitive data
 * Uses AES-256-GCM for authenticated encryption
 */
class EncryptionService {
  constructor() {
    // Decode base64 encryption key
    this.key = Buffer.from(config.ENCRYPTION_KEY, 'base64');
    
    if (this.key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes (base64 encoded)');
    }
  }

  /**
   * Encrypt data
   * @param {string} plaintext - Data to encrypt
   * @returns {string} Base64 encoded encrypted data with IV and auth tag
   */
  encrypt(plaintext) {
    if (!plaintext) {
      throw new Error('Plaintext cannot be empty');
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    // Combine IV + authTag + encrypted data
    const combined = {
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      encrypted: encrypted,
    };
    
    return Buffer.from(JSON.stringify(combined)).toString('base64');
  }

  /**
   * Decrypt data
   * ONLY use when required for AI processing with explicit user consent
   * @param {string} encryptedData - Base64 encoded encrypted data
   * @returns {string} Decrypted plaintext
   */
  decrypt(encryptedData) {
    if (!encryptedData) {
      throw new Error('Encrypted data cannot be empty');
    }

    try {
      const combined = JSON.parse(Buffer.from(encryptedData, 'base64').toString('utf8'));
      
      const iv = Buffer.from(combined.iv, 'base64');
      const authTag = Buffer.from(combined.authTag, 'base64');
      const encrypted = combined.encrypted;
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed: Invalid encrypted data');
    }
  }

  /**
   * Hash data (one-way, for non-sensitive metadata)
   * @param {string} data - Data to hash
   * @returns {string} SHA-256 hash
   */
  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

// Singleton instance
const encryptionService = new EncryptionService();

export default encryptionService;

