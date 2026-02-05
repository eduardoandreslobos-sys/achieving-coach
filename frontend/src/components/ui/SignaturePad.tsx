'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, Check, RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (signatureData: string | null) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

export default function SignaturePad({
  onSignatureChange,
  width = 400,
  height = 150,
  disabled = false,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas with high DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Set initial styles
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  }, [disabled, getCoordinates]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSignature(true);
  }, [isDrawing, disabled, getCoordinates]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const signatureData = canvas.toDataURL('image/png');
      onSignatureChange(signatureData);
    }
  }, [isDrawing, hasSignature, onSignatureChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
    onSignatureChange(null);
  }, [onSignatureChange]);

  return (
    <div className="space-y-2">
      <div className="text-sm text-[var(--fg-muted)] mb-2">
        Dibuja tu firma en el recuadro:
      </div>
      <div className={`relative border-2 border-dashed rounded-lg overflow-hidden ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'border-[var(--border-color)] bg-white cursor-crosshair'
      }`}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="touch-none"
          style={{ display: 'block' }}
        />

        {/* Signature line */}
        <div className="absolute bottom-8 left-8 right-8 border-b border-gray-300" />
        <div className="absolute bottom-2 left-8 text-xs text-gray-400">
          Firma aqui
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={clearSignature}
          disabled={disabled || !hasSignature}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw size={16} />
          Limpiar
        </button>

        {hasSignature && (
          <div className="flex items-center gap-1 text-sm text-emerald-600">
            <Check size={16} />
            Firma capturada
          </div>
        )}
      </div>
    </div>
  );
}
