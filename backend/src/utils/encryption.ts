/**
 * AES-256-GCM Encryption Utility
 *
 * Provides field-level encryption for sensitive data compliance
 * with GDPR, CCPA, and HIPAA requirements.
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits
const KEY_LENGTH = 32; // 256 bits

/**
 * Get encryption key from environment variable
 */
function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  // Derive a proper 256-bit key using SHA-256
  return crypto.createHash('sha256').update(key).digest();
}

/**
 * Encrypt a string value using AES-256-GCM
 * @param plaintext - The string to encrypt
 * @returns Encrypted string in format: iv:authTag:ciphertext (base64 encoded)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;

  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  // Combine IV, auth tag, and ciphertext
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/**
 * Decrypt a string value encrypted with AES-256-GCM
 * @param encryptedText - The encrypted string in format: iv:authTag:ciphertext
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

  const key = getKey();
  const parts = encryptedText.split(':');

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }

  const [ivBase64, authTagBase64, ciphertext] = parts;
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Check if a value appears to be encrypted
 * @param value - The value to check
 * @returns true if the value appears to be encrypted
 */
export function isEncrypted(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const parts = value.split(':');
  return parts.length === 3 && parts.every(part => {
    try {
      Buffer.from(part, 'base64');
      return true;
    } catch {
      return false;
    }
  });
}

/**
 * Encrypt specific fields in an object
 * @param data - The object containing fields to encrypt
 * @param fieldsToEncrypt - Array of field names to encrypt
 * @returns Object with specified fields encrypted
 */
export function encryptFields<T extends Record<string, any>>(
  data: T,
  fieldsToEncrypt: (keyof T)[]
): T {
  const result = { ...data };

  for (const field of fieldsToEncrypt) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = encrypt(result[field]) as T[keyof T];
    }
  }

  return result;
}

/**
 * Decrypt specific fields in an object
 * @param data - The object containing encrypted fields
 * @param fieldsToDecrypt - Array of field names to decrypt
 * @returns Object with specified fields decrypted
 */
export function decryptFields<T extends Record<string, any>>(
  data: T,
  fieldsToDecrypt: (keyof T)[]
): T {
  const result = { ...data };

  for (const field of fieldsToDecrypt) {
    if (result[field] && typeof result[field] === 'string' && isEncrypted(result[field])) {
      try {
        result[field] = decrypt(result[field]) as T[keyof T];
      } catch (error) {
        console.error(`Failed to decrypt field ${String(field)}:`, error);
        // Keep original value if decryption fails
      }
    }
  }

  return result;
}

/**
 * Hash a value using SHA-256 (for non-reversible operations)
 * @param value - The value to hash
 * @returns Hex-encoded hash
 */
export function hash(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Generate a secure random token
 * @param length - Token length in bytes (default 32)
 * @returns Hex-encoded random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Sensitive fields that should be encrypted in various collections
export const SENSITIVE_FIELDS: Record<string, string[]> = {
  sessions: ['notes', 'privateNotes', 'observations'],
  reflections: ['content', 'insights'],
  goals: ['description', 'notes'],
  tool_results: ['responses', 'notes'],
  conversations: [], // Messages are encrypted at subcollection level
  messages: ['content'],
  stakeholder_feedback: ['feedback', 'comments'],
};
