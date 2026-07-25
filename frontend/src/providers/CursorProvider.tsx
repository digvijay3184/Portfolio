'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export type CursorType = 'default' | 'link' | 'button' | 'card' | 'drag' | 'disabled' | 'hidden';

interface CursorContextType {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
  x: any;
  y: any;
  smoothX: any;
  smoothY: any;
  isClicking: boolean;
  isActive: boolean;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children, enabled = true }: { children: React.ReactNode, enabled?: boolean }) {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const prefersReducedMotion = useReducedMotion();

  // Raw coordinates
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Eased coordinates
  const springConfig = { damping: 25, stiffness: 800, mass: 0.1 };
  const smoothX = useSpring(x, prefersReducedMotion ? { damping: 100, stiffness: 1000 } : springConfig);
  const smoothY = useSpring(y, prefersReducedMotion ? { damping: 100, stiffness: 1000 } : springConfig);

  useEffect(() => {
    if (!enabled) {
      setIsActive(false);
      return;
    }
    
    // Disable on touch devices
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isTouch) {
      setIsActive(false);
      return;
    }

    setIsActive(true);

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      // Determine cursor type via data-cursor attribute
      const target = e.target as HTMLElement;
      
      // Auto-detect links if they don't have data-cursor explicitly
      if (target.closest('a')) {
        setCursorType('link');
      } else if (target.closest('button')) {
        setCursorType('button');
      } else {
        const customCursor = target.closest('[data-cursor]');
        if (customCursor) {
          setCursorType(customCursor.getAttribute('data-cursor') as CursorType);
        } else {
          setCursorType('default');
        }
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setCursorType('hidden');
    const handleMouseEnter = () => setCursorType('default');

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, x, y]);

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType, x, y, smoothX, smoothY, isClicking, isActive }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}
