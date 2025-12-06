'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { 
  uploadImage,
  getImageDimensions, 
  generateAltTextSuggestions,
  validateImageFile,
  type ImageUploadResult
} from '@/lib/imageUtils';

interface ImageUploadProps {
  onImageUploaded: (result: ImageUploadResult) => void;
  context?: string;
  buttonText?: string;
}

export default function ImageUpload({ onImageUploaded, context, buttonText = 'Insert Image' }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [altSuggestions, setAltSuggestions] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);
    } catch (err) {
      console.error('Error getting dimensions:', err);
    }

    const suggestions = generateAltTextSuggestions(file.name, context);
    setAltSuggestions(suggestions);
    setAltText(suggestions[0] || '');
  };

  const handleUpload = async () => {
    if (!selectedFile || !altText) return;

    setUploading(true);
    setError(null);
    
    try {
      const result = await uploadImage(selectedFile, context);
      result.alt = altText;
      
      onImageUploaded(result);
      
      // Reset
      handleCancel();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setAltText('');
    setAltSuggestions([]);
    setDimensions(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">Click to upload image</p>
          <p className="text-sm text-gray-500">JPEG, PNG, or WebP • Max 10MB</p>
          <p className="text-xs text-gray-400 mt-2">Auto-converted to WebP format</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={preview || ''}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {dimensions && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>{dimensions.width} × {dimensions.height}px</span>
              </div>
              <div>Size: {(selectedFile.size / 1024).toFixed(1)} KB</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ALT Text (SEO) *
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility and SEO"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={uploading}
            />
          </div>

          {altSuggestions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                AI Suggestions:
              </label>
              <div className="space-y-2">
                {altSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setAltText(suggestion)}
                    disabled={uploading}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition-all disabled:opacity-50 ${
                      altText === suggestion
                        ? 'border-primary-500 bg-primary-50 text-primary-900'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{suggestion}</span>
                      {altText === suggestion && <Check className="w-4 h-4 text-primary-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handleUpload}
              disabled={uploading || !altText}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                buttonText
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Image will be uploaded to Firebase Storage, automatically converted to WebP, and compressed for optimal performance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
