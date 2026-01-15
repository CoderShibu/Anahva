#!/usr/bin/env node

/**
 * Generate Security Keys
 * Generates JWT_SECRET and ENCRYPTION_KEY for .env
 */

import crypto from 'crypto';

// Generate JWT Secret (32 bytes, hex encoded)
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Generate Encryption Key (32 bytes, base64 encoded for AES-256)
const encryptionKey = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Security Keys Generated for .env file:');
console.log('='.repeat(70));
console.log('\n# JWT Secret (for session tokens):');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('\n# Encryption Key (for data encryption):');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log('\n' + '='.repeat(70));
console.log('\n⚠️  IMPORTANT:');
console.log('  1. Copy the keys above into your .env file');
console.log('  2. Never commit .env to version control');
console.log('  3. Keep these keys secure - they control your data encryption');
console.log('  4. Losing these keys means losing access to encrypted data\n');

