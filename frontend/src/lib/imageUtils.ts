import imageCompression from 'browser-image-compression';
import { uploadImageToStorage } from './storage';

export interface ImageUploadResult {
  url: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  alt: string;
}

/**
 * Convert image to WebP and compress
 */
export async function convertToWebP(file: File): Promise<Blob> {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp' as const,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error converting to WebP:', error);
    throw error;
  }
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Generate SEO-friendly filename
 */
export function generateSEOFilename(originalName: string, context?: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  let seoName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (context) {
    const seoContext = context.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    seoName = `${seoContext}-${seoName}`;
  }

  const timestamp = Date.now();
  
  return `${seoName}-${timestamp}.webp`;
}

/**
 * Generate AI-powered ALT text suggestions
 */
export function generateAltTextSuggestions(filename: string, context?: string): string[] {
  const suggestions: string[] = [];
  
  const words = filename
    .replace(/\.[^/.]+$/, '')
    .split(/[-_\s]+/)
    .filter(word => word.length > 2 && !word.match(/^\d+$/));

  if (context) {
    suggestions.push(`${context} - ${words.join(' ')}`);
    suggestions.push(`Professional ${context.toLowerCase()} showing ${words.join(' ')}`);
  }
  
  suggestions.push(words.join(' '));
  suggestions.push(`${words.join(' ')} illustration`);
  suggestions.push(`High-quality image of ${words.join(' ')}`);

  if (context?.toLowerCase().includes('coach')) {
    suggestions.push(`Coaching ${words.join(' ')} for professional development`);
    suggestions.push(`ICF-compliant coaching ${words.join(' ')}`);
  }

  return suggestions;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.',
    };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.',
    };
  }

  return { valid: true };
}

/**
 * Upload image and return URL
 */
export async function uploadImage(
  file: File,
  context?: string
): Promise<ImageUploadResult> {
  // Validate
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Convert to WebP
  const webpBlob = await convertToWebP(file);
  
  // Generate filename
  const filename = generateSEOFilename(file.name, context);
  
  // Upload to Firebase Storage
  const url = await uploadImageToStorage(webpBlob, filename);
  
  // Get dimensions
  const dimensions = await getImageDimensions(file);
  
  return {
    url,
    filename,
    size: webpBlob.size,
    width: dimensions.width,
    height: dimensions.height,
    alt: '',
  };
}
