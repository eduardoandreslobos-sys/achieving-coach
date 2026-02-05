import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignaturePad from '../SignaturePad';

// Mock canvas context
const mockGetContext = jest.fn(() => ({
  strokeStyle: '',
  lineWidth: 0,
  lineCap: '',
  lineJoin: '',
  fillStyle: '',
  scale: jest.fn(),
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
}));

HTMLCanvasElement.prototype.getContext = mockGetContext as any;
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,mockBase64Data');

describe('SignaturePad', () => {
  const mockOnSignatureChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the signature pad with instructions', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      expect(screen.getByText('Dibuja tu firma en el recuadro:')).toBeInTheDocument();
      expect(screen.getByText('Firma aqui')).toBeInTheDocument();
    });

    it('should render with default dimensions', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas?.style.width).toBe('400px');
      expect(canvas?.style.height).toBe('150px');
    });

    it('should render with custom dimensions', () => {
      render(
        <SignaturePad
          onSignatureChange={mockOnSignatureChange}
          width={300}
          height={100}
        />
      );

      const canvas = document.querySelector('canvas');
      expect(canvas?.style.width).toBe('300px');
      expect(canvas?.style.height).toBe('100px');
    });

    it('should render the clear button', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      expect(screen.getByText('Limpiar')).toBeInTheDocument();
    });

    it('should have disabled clear button initially', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const clearButton = screen.getByText('Limpiar').closest('button');
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Drawing interactions', () => {
    it('should initialize canvas context on mount', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      expect(mockGetContext).toHaveBeenCalledWith('2d');
    });

    it('should handle mouse down event', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');
      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });

      // Canvas context methods should have been called
      expect(mockGetContext).toHaveBeenCalled();
    });

    it('should handle mouse move during drawing', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');

      // Start drawing
      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });
      // Draw
      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 60 });

      expect(mockGetContext).toHaveBeenCalled();
    });

    it('should handle mouse up event and call onSignatureChange', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');

      // Simulate drawing
      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });
      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 60 });
      fireEvent.mouseUp(canvas!);

      // The callback should be called with the signature data
      expect(mockOnSignatureChange).toHaveBeenCalled();
    });

    it('should handle mouse leave during drawing', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');

      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });
      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 60 });
      fireEvent.mouseLeave(canvas!);

      expect(mockOnSignatureChange).toHaveBeenCalled();
    });

    it('should handle touch events', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');

      // Simulate touch drawing
      fireEvent.touchStart(canvas!, {
        touches: [{ clientX: 100, clientY: 50 }]
      });
      fireEvent.touchMove(canvas!, {
        touches: [{ clientX: 150, clientY: 60 }]
      });
      fireEvent.touchEnd(canvas!);

      expect(mockOnSignatureChange).toHaveBeenCalled();
    });
  });

  describe('Clear functionality', () => {
    it('should enable clear button after drawing', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');

      // Simulate drawing
      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });
      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 60 });
      fireEvent.mouseUp(canvas!);

      const clearButton = screen.getByText('Limpiar').closest('button');
      expect(clearButton).not.toBeDisabled();
    });

    it('should clear signature and call onSignatureChange with null', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');

      // First draw something
      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });
      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 60 });
      fireEvent.mouseUp(canvas!);

      mockOnSignatureChange.mockClear();

      // Then clear
      const clearButton = screen.getByText('Limpiar').closest('button');
      fireEvent.click(clearButton!);

      expect(mockOnSignatureChange).toHaveBeenCalledWith(null);
    });

    it('should show "Firma capturada" after drawing', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');

      // Simulate drawing
      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });
      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 60 });
      fireEvent.mouseUp(canvas!);

      expect(screen.getByText('Firma capturada')).toBeInTheDocument();
    });

    it('should hide "Firma capturada" after clearing', () => {
      render(<SignaturePad onSignatureChange={mockOnSignatureChange} />);

      const canvas = document.querySelector('canvas');

      // Draw
      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });
      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 60 });
      fireEvent.mouseUp(canvas!);

      // Clear
      const clearButton = screen.getByText('Limpiar').closest('button');
      fireEvent.click(clearButton!);

      expect(screen.queryByText('Firma capturada')).not.toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('should not allow drawing when disabled', () => {
      render(
        <SignaturePad
          onSignatureChange={mockOnSignatureChange}
          disabled={true}
        />
      );

      const canvas = document.querySelector('canvas');

      fireEvent.mouseDown(canvas!, { clientX: 100, clientY: 50 });
      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 60 });
      fireEvent.mouseUp(canvas!);

      // Should not have signature since drawing is disabled
      expect(mockOnSignatureChange).not.toHaveBeenCalled();
    });

    it('should apply disabled styling', () => {
      render(
        <SignaturePad
          onSignatureChange={mockOnSignatureChange}
          disabled={true}
        />
      );

      const container = document.querySelector('.cursor-not-allowed');
      expect(container).toBeInTheDocument();
    });
  });
});
