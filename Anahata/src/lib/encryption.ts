/**
 * Frontend Encryption Utility
 * Uses Web Crypto API for AES-256-GCM encryption
 * Matches backend encryption standards
 */

/**
 * Encrypt data using AES-256-GCM
 * @param data - Data to encrypt
 * @param key - Encryption key (will be derived from a master key)
 * @returns Promise<string> - Base64 encoded encrypted data with IV and auth tag
 */
export async function encryptData(
  data: string,
  masterKey: string = 'default-frontend-key'
): Promise<string> {
  // For frontend, we use a simplified encryption that's compatible with backend
  // In production, the key should be derived from user password or stored securely
  
  // Derive key using PBKDF2
  const encoder = new TextEncoder();
  const keyData = encoder.encode(masterKey);
  
  const baseKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const derivedKeyBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode('anahva-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    256 // 256 bits = 32 bytes for AES-256
  );
  
  // Import the derived key for AES-GCM
  const encryptionKey = await crypto.subtle.importKey(
    'raw',
    derivedKeyBits,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  // Generate random IV (16 bytes)
  const iv = crypto.getRandomValues(new Uint8Array(16));
  
  // Encrypt the data
  const dataBuffer = encoder.encode(data);
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    dataBuffer
  );
  
  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  // Return as base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData - Base64 encoded encrypted data with IV
 * @param key - Encryption key
 * @returns Promise<string> - Decrypted data
 */
export async function decryptData(
  encryptedData: string,
  masterKey: string = 'default-frontend-key'
): Promise<string> {
  try {
    // Decode base64
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(c => c.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 16);
    const encryptedBytes = combined.slice(16);
    
    // Derive key (same as encryption)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(masterKey);
    
    const baseKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const derivedKeyBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode('anahva-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      baseKey,
      256
    );
    
    // Import the derived key for AES-GCM
    const decryptionKey = await crypto.subtle.importKey(
      'raw',
      derivedKeyBits,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decrypt
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      decryptionKey,
      encryptedBytes
    );
    
    // Return as string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}
