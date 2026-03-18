import { describe, it, expect } from 'vitest'

// Set env before importing
process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

import { encrypt, decrypt } from '../crypto'

describe('crypto', () => {
  it('should encrypt and decrypt a string roundtrip', () => {
    const plaintext = 'my-secret-token-12345'
    const encrypted = encrypt(plaintext)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(plaintext)
  })

  it('should produce different ciphertexts for same input (random IV)', () => {
    const plaintext = 'same-input'
    const a = encrypt(plaintext)
    const b = encrypt(plaintext)
    expect(a).not.toBe(b)
    expect(decrypt(a)).toBe(plaintext)
    expect(decrypt(b)).toBe(plaintext)
  })

  it('should handle empty strings', () => {
    const encrypted = encrypt('')
    expect(decrypt(encrypted)).toBe('')
  })

  it('should handle unicode', () => {
    const text = 'Hello 世界 🌍'
    expect(decrypt(encrypt(text))).toBe(text)
  })

  it('should produce format iv:authTag:ciphertext', () => {
    const encrypted = encrypt('test')
    const parts = encrypted.split(':')
    expect(parts).toHaveLength(3)
    expect(parts[0]).toHaveLength(32) // 16 bytes hex
    expect(parts[1]).toHaveLength(32) // 16 bytes hex
    expect(parts[2].length).toBeGreaterThan(0)
  })
})
