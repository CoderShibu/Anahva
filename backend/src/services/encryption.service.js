// AES-256-GCM Encryption Service
import crypto from 'crypto';
import config from '../config/env.js';

class EncryptionService {
    constructor() {
        // Decode the base64 encryption key
        this.key = Buffer.from(config.encryptionKey, 'base64');

        if (this.key.length !== 32) {
            throw new Error('ENCRYPTION_KEY must be 32 bytes when base64-decoded');
        }
    }

    /**
     * Encrypt data using AES-256-GCM
     * @param {string} plaintext - Data to encrypt
     * @returns {string} Base64 encoded encrypted data (iv:authTag:ciphertext)
     */
    encrypt(plaintext) {
        try {
            // Generate random IV (16 bytes for AES)
            const iv = crypto.randomBytes(16);

            // Create cipher
            const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);

            // Encrypt
            let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
            ciphertext += cipher.final('base64');

            // Get auth tag
            const authTag = cipher.getAuthTag();

            // Combine: iv:authTag:ciphertext
            const combined = Buffer.concat([
                iv,
                authTag,
                Buffer.from(ciphertext, 'base64')
            ]);

            return combined.toString('base64');
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Encryption failed');
        }
    }

    /**
     * Decrypt data using AES-256-GCM
     * @param {string} encryptedData - Base64 encoded encrypted data
     * @returns {string} Decrypted plaintext
     */
    decrypt(encryptedData) {
        try {
            // Decode from base64
            const combined = Buffer.from(encryptedData, 'base64');

            // Extract components
            const iv = combined.slice(0, 16);
            const authTag = combined.slice(16, 32);
            const ciphertext = combined.slice(32);

            // Create decipher
            const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
            decipher.setAuthTag(authTag);

            // Decrypt
            let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
            plaintext += decipher.final('utf8');

            return plaintext;
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Decryption failed');
        }
    }
}

export default new EncryptionService();
