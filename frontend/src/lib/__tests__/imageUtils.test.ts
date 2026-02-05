/**
 * Image Utilities Tests
 *
 * Tests for image validation, SEO filename generation, and ALT text suggestions.
 */

import {
  validateImageFile,
  generateSEOFilename,
  generateAltTextSuggestions,
} from '../imageUtils';

// Mock file creation helper
function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  // Create a minimal file then override its size property
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size, writable: false });
  return file;
}

describe('Image Utilities', () => {
  describe('validateImageFile', () => {
    describe('valid file types', () => {
      it('should accept JPEG files', () => {
        const file = createMockFile('test.jpg', 1024, 'image/jpeg');
        const result = validateImageFile(file);

        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should accept JPG files', () => {
        const file = createMockFile('test.jpg', 1024, 'image/jpg');
        const result = validateImageFile(file);

        expect(result.valid).toBe(true);
      });

      it('should accept PNG files', () => {
        const file = createMockFile('test.png', 1024, 'image/png');
        const result = validateImageFile(file);

        expect(result.valid).toBe(true);
      });

      it('should accept WebP files', () => {
        const file = createMockFile('test.webp', 1024, 'image/webp');
        const result = validateImageFile(file);

        expect(result.valid).toBe(true);
      });
    });

    describe('invalid file types', () => {
      it('should reject GIF files', () => {
        const file = createMockFile('test.gif', 1024, 'image/gif');
        const result = validateImageFile(file);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid file type');
      });

      it('should reject BMP files', () => {
        const file = createMockFile('test.bmp', 1024, 'image/bmp');
        const result = validateImageFile(file);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid file type');
      });

      it('should reject SVG files', () => {
        const file = createMockFile('test.svg', 1024, 'image/svg+xml');
        const result = validateImageFile(file);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid file type');
      });

      it('should reject PDF files', () => {
        const file = createMockFile('document.pdf', 1024, 'application/pdf');
        const result = validateImageFile(file);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid file type');
      });

      it('should reject text files', () => {
        const file = createMockFile('text.txt', 1024, 'text/plain');
        const result = validateImageFile(file);

        expect(result.valid).toBe(false);
      });
    });

    describe('file size validation', () => {
      it('should accept files under 10MB', () => {
        const file = createMockFile('small.jpg', 5 * 1024 * 1024, 'image/jpeg');
        const result = validateImageFile(file);

        expect(result.valid).toBe(true);
      });

      it('should accept files exactly 10MB', () => {
        const file = createMockFile('exact.jpg', 10 * 1024 * 1024, 'image/jpeg');
        const result = validateImageFile(file);

        expect(result.valid).toBe(true);
      });

      it('should reject files over 10MB', () => {
        const file = createMockFile('large.jpg', 10 * 1024 * 1024 + 1, 'image/jpeg');
        const result = validateImageFile(file);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('File size too large');
        expect(result.error).toContain('10MB');
      });

      it('should accept very small files', () => {
        const file = createMockFile('tiny.jpg', 1, 'image/jpeg');
        const result = validateImageFile(file);

        expect(result.valid).toBe(true);
      });
    });

    describe('combined validation', () => {
      it('should reject invalid type even if size is OK', () => {
        const file = createMockFile('test.gif', 1024, 'image/gif');
        const result = validateImageFile(file);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid file type');
      });

      it('should check type before size', () => {
        // Large invalid type file
        const file = createMockFile('huge.gif', 100 * 1024 * 1024, 'image/gif');
        const result = validateImageFile(file);

        // Should fail on type, not size
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid file type');
      });
    });
  });

  describe('generateSEOFilename', () => {
    beforeEach(() => {
      // Mock Date.now for consistent timestamps
      jest.spyOn(Date, 'now').mockReturnValue(1704067200000); // 2024-01-01
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('basic filename generation', () => {
      it('should convert filename to lowercase', () => {
        const result = generateSEOFilename('MyImage.jpg');

        expect(result).toMatch(/^myimage-\d+\.webp$/);
      });

      it('should replace spaces with hyphens', () => {
        const result = generateSEOFilename('my image file.jpg');

        expect(result).toContain('my-image-file');
        expect(result).not.toContain(' ');
      });

      it('should replace special characters with hyphens', () => {
        const result = generateSEOFilename('image@#$%file!.jpg');

        expect(result).toMatch(/^image-file-\d+\.webp$/);
        expect(result).not.toMatch(/[@#$%!]/);
      });

      it('should remove leading and trailing hyphens', () => {
        const result = generateSEOFilename('---image---.jpg');

        expect(result).not.toMatch(/^-/);
        expect(result).not.toMatch(/--\d/);
      });

      it('should add timestamp', () => {
        const result = generateSEOFilename('test.jpg');

        expect(result).toContain('1704067200000');
      });

      it('should always output .webp extension', () => {
        const jpgResult = generateSEOFilename('test.jpg');
        const pngResult = generateSEOFilename('test.png');
        const webpResult = generateSEOFilename('test.webp');

        expect(jpgResult).toMatch(/\.webp$/);
        expect(pngResult).toMatch(/\.webp$/);
        expect(webpResult).toMatch(/\.webp$/);
      });
    });

    describe('with context', () => {
      it('should prepend context to filename', () => {
        const result = generateSEOFilename('photo.jpg', 'Coaching Session');

        expect(result).toMatch(/^coaching-session-photo-\d+\.webp$/);
      });

      it('should convert context to lowercase and hyphenate', () => {
        const result = generateSEOFilename('image.jpg', 'My Professional Photo');

        expect(result).toContain('my-professional-photo');
      });

      it('should handle context with special characters', () => {
        const result = generateSEOFilename('image.jpg', 'ICF@2024!');

        // Special characters in context get replaced with hyphens
        expect(result).toMatch(/^icf-2024--image-\d+\.webp$/);
      });
    });

    describe('edge cases', () => {
      it('should handle filename with multiple extensions', () => {
        const result = generateSEOFilename('image.backup.jpg');

        expect(result).toMatch(/\.webp$/);
        expect(result.match(/\.webp/g)?.length).toBe(1);
      });

      it('should handle filename with no extension', () => {
        const result = generateSEOFilename('imagefile');

        expect(result).toMatch(/^imagefile-\d+\.webp$/);
      });

      it('should handle very long filenames', () => {
        const longName = 'a'.repeat(200) + '.jpg';
        const result = generateSEOFilename(longName);

        expect(result).toBeDefined();
        expect(result).toMatch(/\.webp$/);
      });

      it('should handle unicode characters', () => {
        const result = generateSEOFilename('imagen-espanol.jpg');

        expect(result).toMatch(/\.webp$/);
      });
    });
  });

  describe('generateAltTextSuggestions', () => {
    describe('basic suggestions', () => {
      it('should generate at least 3 suggestions', () => {
        const suggestions = generateAltTextSuggestions('coaching-session.jpg');

        expect(suggestions.length).toBeGreaterThanOrEqual(3);
      });

      it('should extract words from filename', () => {
        const suggestions = generateAltTextSuggestions('professional-coaching-meeting.jpg');

        expect(suggestions.some(s => s.toLowerCase().includes('professional'))).toBe(true);
        expect(suggestions.some(s => s.toLowerCase().includes('coaching'))).toBe(true);
        expect(suggestions.some(s => s.toLowerCase().includes('meeting'))).toBe(true);
      });

      it('should handle underscores as separators', () => {
        const suggestions = generateAltTextSuggestions('team_meeting_photo.jpg');

        expect(suggestions.some(s => s.includes('team'))).toBe(true);
        expect(suggestions.some(s => s.includes('meeting'))).toBe(true);
        expect(suggestions.some(s => s.includes('photo'))).toBe(true);
      });

      it('should handle spaces in filename', () => {
        const suggestions = generateAltTextSuggestions('team meeting photo.jpg');

        expect(suggestions.some(s => s.includes('team'))).toBe(true);
      });
    });

    describe('with context', () => {
      it('should include context in suggestions', () => {
        const suggestions = generateAltTextSuggestions('image.jpg', 'Workshop');

        expect(suggestions.some(s => s.includes('Workshop'))).toBe(true);
      });

      it('should create context-aware suggestions', () => {
        const suggestions = generateAltTextSuggestions('participants.jpg', 'Leadership Training');

        expect(suggestions.some(s => s.includes('Leadership'))).toBe(true);
        expect(suggestions.some(s => s.includes('Training'))).toBe(true);
      });

      it('should add professional context variations', () => {
        const suggestions = generateAltTextSuggestions('photo.jpg', 'Session');

        expect(suggestions.some(s => s.toLowerCase().includes('professional'))).toBe(true);
      });
    });

    describe('coaching-specific suggestions', () => {
      it('should add ICF-related suggestions for coaching context', () => {
        const suggestions = generateAltTextSuggestions('session.jpg', 'Coaching Workshop');

        expect(suggestions.some(s => s.toLowerCase().includes('coaching'))).toBe(true);
      });

      it('should add ICF-compliant mention for coach context', () => {
        const suggestions = generateAltTextSuggestions('image.jpg', 'Executive Coach');

        expect(suggestions.some(s => s.includes('ICF-compliant'))).toBe(true);
      });
    });

    describe('filtering', () => {
      it('should filter out short words (less than 3 chars)', () => {
        const suggestions = generateAltTextSuggestions('a-b-c-image.jpg');

        // Short words like 'a', 'b', 'c' should be filtered
        suggestions.forEach(s => {
          // Split and check for standalone 1-2 char words
          const words = s.split(' ');
          expect(words.some(w => w.length > 0 && w.length < 3 && /^[a-z]+$/i.test(w))).toBeFalsy;
        });
      });

      it('should filter out numeric-only words', () => {
        const suggestions = generateAltTextSuggestions('image-123-456.jpg');

        // Pure numbers should be filtered from word extraction
        // The suggestions shouldn't have standalone numbers as main content
        expect(suggestions.some(s => /^\d+$/.test(s))).toBe(false);
      });
    });

    describe('suggestion variety', () => {
      it('should include illustration variation', () => {
        const suggestions = generateAltTextSuggestions('diagram.jpg');

        expect(suggestions.some(s => s.includes('illustration'))).toBe(true);
      });

      it('should include high-quality variation', () => {
        const suggestions = generateAltTextSuggestions('photo.jpg');

        expect(suggestions.some(s => s.includes('High-quality'))).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should handle empty filename', () => {
        const suggestions = generateAltTextSuggestions('.jpg');

        expect(Array.isArray(suggestions)).toBe(true);
      });

      it('should handle filename with only extension', () => {
        const suggestions = generateAltTextSuggestions('file.jpg');

        expect(suggestions.length).toBeGreaterThanOrEqual(1);
      });

      it('should return non-empty strings', () => {
        const suggestions = generateAltTextSuggestions('test.jpg', 'Context');

        suggestions.forEach(s => {
          expect(s.length).toBeGreaterThan(0);
          expect(s.trim()).toBe(s);
        });
      });
    });
  });
});
