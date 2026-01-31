// Generate security keys for Anahata backend
import crypto from 'crypto';

console.log('\n🔐 Security Keys Generated for .env file:');
console.log('======================================================================\n');

// Generate JWT Secret (32 bytes, hex encoded)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('# JWT Secret (for session tokens):');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Generate Encryption Key (32 bytes, base64 encoded)
const encryptionKey = crypto.randomBytes(32).toString('base64');
console.log('# Encryption Key (for data encryption):');
console.log(`ENCRYPTION_KEY=${encryptionKey}\n`);

console.log('======================================================================');
console.log('Copy these values to your .env file in the backend directory');
console.log('======================================================================\n');
