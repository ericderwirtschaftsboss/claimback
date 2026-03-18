import { describe, it, expect } from 'vitest'
import { extractPlainText, stripHtml, truncateBody } from '../gmail/parser'

describe('parser', () => {
  describe('extractPlainText', () => {
    it('should extract plain text from simple payload', () => {
      const payload = {
        mimeType: 'text/plain',
        body: { data: Buffer.from('Hello World').toString('base64') },
      }
      expect(extractPlainText(payload)).toBe('Hello World')
    })

    it('should extract from multipart payload preferring text/plain', () => {
      const payload = {
        mimeType: 'multipart/alternative',
        parts: [
          {
            mimeType: 'text/plain',
            body: { data: Buffer.from('Plain text').toString('base64') },
          },
          {
            mimeType: 'text/html',
            body: { data: Buffer.from('<b>HTML</b>').toString('base64') },
          },
        ],
      }
      expect(extractPlainText(payload)).toBe('Plain text')
    })

    it('should fallback to HTML when no plain text', () => {
      const payload = {
        mimeType: 'multipart/alternative',
        parts: [
          {
            mimeType: 'text/html',
            body: { data: Buffer.from('<p>Hello</p>').toString('base64') },
          },
        ],
      }
      const result = extractPlainText(payload)
      expect(result).toContain('Hello')
      expect(result).not.toContain('<p>')
    })

    it('should handle empty payload', () => {
      expect(extractPlainText({})).toBe('')
    })
  })

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World')
    })

    it('should remove style tags', () => {
      expect(stripHtml('<style>.foo{color:red}</style>Content')).toBe('Content')
    })

    it('should decode entities', () => {
      expect(stripHtml('&amp; &lt; &gt; &quot; &#39;')).toBe('& < > " \'')
    })
  })

  describe('truncateBody', () => {
    it('should not truncate short text', () => {
      expect(truncateBody('short')).toBe('short')
    })

    it('should truncate at 4000 chars', () => {
      const long = 'a'.repeat(5000)
      const result = truncateBody(long)
      expect(result.length).toBe(4003) // 4000 + '...'
      expect(result.endsWith('...')).toBe(true)
    })
  })
})
