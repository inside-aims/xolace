import { useRef, useCallback, useState, RefObject } from 'react';

interface PixelData {
  x: number;
  y: number;
  r: number;
  color: string;
}

interface UseCanvasAnimationProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  content: string;
  onAnimationComplete?: () => void;
}

interface UseCanvasAnimationReturn {
  canvasRef: RefObject<HTMLCanvasElement | null> | null;
  isAnimating: boolean;
  startAnimation: () => void;
  stopAnimation: () => void;
}

/**
 * Custom hook for text "vanish" canvas animation
 * 
 * Features:
 * - Draws textarea content onto canvas
 * - Animates particles dispersing
 * - Proper cleanup and state management
 * - Callback on completion
 * 
 * @improvements
 * 1. Extracted complex canvas logic from component
 * 2. Separated drawing and animation concerns
 * 3. Better animation frame management
 * 4. Configurable completion callback
 * 5. Animation state tracking
 * 6. Reusable across components
 */
export function useCanvasAnimation({
  textareaRef,
  content,
  onAnimationComplete,
}: UseCanvasAnimationProps): UseCanvasAnimationReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelDataRef = useRef<PixelData[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Draw text content onto canvas and extract pixel data
   */
  const drawToCanvas = useCallback(() => {
    if (!textareaRef) return;
    const textarea = textareaRef.current;
    const canvas = canvasRef.current;
    
    if (!textarea || !canvas) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Set canvas size to match textarea
    canvas.width = textarea.offsetWidth;
    canvas.height = textarea.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get computed styles from textarea
    const computedStyles = getComputedStyle(textarea);
    const fontSize = parseFloat(computedStyles.getPropertyValue('font-size'));
    
    ctx.font = `${fontSize}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = computedStyles.color;

    // Render text lines
    const lines = content.split('\n');
    const lineHeight = fontSize * 1.2;

    lines.forEach((line, index) => {
      ctx.fillText(line, 16, (index + 1) * lineHeight);
    });

    // Extract pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    const newPixelData: PixelData[] = [];

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        
        // Check if pixel is not transparent
        if (
          pixelData[index] !== 0 ||
          pixelData[index + 1] !== 0 ||
          pixelData[index + 2] !== 0
        ) {
          newPixelData.push({
            x,
            y,
            r: 1,
            color: `rgba(${pixelData[index]}, ${pixelData[index + 1]}, ${pixelData[index + 2]}, ${pixelData[index + 3] / 255})`,
          });
        }
      }
    }

    pixelDataRef.current = newPixelData;
    return true;
  }, [textareaRef, content]);

  /**
   * Animate particles dispersing
   */
  const animate = useCallback((startX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animateFrame = (pos: number = startX) => {
      // Update particle positions
      const newPixelData: PixelData[] = [];
      
      for (const particle of pixelDataRef.current) {
        if (particle.x < pos) {
          newPixelData.push(particle);
        } else {
          if (particle.r <= 0) continue;

          // Random movement
          particle.x += Math.random() > 0.5 ? 1 : -1;
          particle.y += Math.random() > 0.5 ? 1 : -1;
          particle.r -= 0.05 * Math.random();
          newPixelData.push(particle);
        }
      }

      pixelDataRef.current = newPixelData;

      // Clear and redraw
      ctx.clearRect(pos, 0, canvas.width, canvas.height);
      
      newPixelData.forEach(particle => {
        if (particle.x > pos) {
          ctx.beginPath();
          ctx.rect(particle.x, particle.y, particle.r, particle.r);
          ctx.fillStyle = particle.color;
          ctx.strokeStyle = particle.color;
          ctx.stroke();
        }
      });

      // Continue animation or complete
      if (newPixelData.length > 0) {
        animationFrameRef.current = requestAnimationFrame(() => 
          animateFrame(pos - 8)
        );
      } else {
        setIsAnimating(false);
        onAnimationComplete?.();
      }
    };

    animateFrame(startX);
  }, [onAnimationComplete]);

  /**
   * Start the vanish animation
   */
  const startAnimation = useCallback(() => {
    if (isAnimating || !content.trim()) return;

    setIsAnimating(true);
    
    // Draw content to canvas
    const success = drawToCanvas();
    if (!success) {
      setIsAnimating(false);
      return;
    }

    // Find rightmost pixel for animation start
    const maxX = pixelDataRef.current.reduce(
      (max, particle) => Math.max(max, particle.x),
      0
    );

    // Start animation from right to left
    animate(maxX);
  }, [isAnimating, content, drawToCanvas, animate]);

  /**
   * Stop animation and cleanup
   */
  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsAnimating(false);
    pixelDataRef.current = [];
  }, []);

  return {
    canvasRef,
    isAnimating,
    startAnimation,
    stopAnimation,
  };
}