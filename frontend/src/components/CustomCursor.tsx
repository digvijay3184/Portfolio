'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCursor } from '@/providers/CursorProvider';

export default function CustomCursor() {
  const { cursorType, smoothX, smoothY, isClicking, isActive } = useCursor();
  const prefersReducedMotion = useReducedMotion();

  if (!isActive || cursorType === 'hidden' || cursorType === 'disabled') {
    return null;
  }

  // Define states for the cursor
  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: '#EA580C',
      border: '0px solid transparent',
      x: '-50%',
      y: '-50%',
      scale: isClicking && !prefersReducedMotion ? 0.5 : 1,
      opacity: 1,
    },
    link: {
      width: 40,
      height: 40,
      backgroundColor: 'transparent',
      border: '2px solid #FBBF24',
      x: '-50%',
      y: '-50%',
      scale: isClicking && !prefersReducedMotion ? 0.8 : 1,
      opacity: 1,
    },
    button: {
      width: 8,
      height: 8,
      backgroundColor: '#F97316',
      border: '0px solid transparent',
      x: '-50%',
      y: '-50%',
      scale: isClicking && !prefersReducedMotion ? 0.5 : 1,
      opacity: 1,
    },
    card: {
      width: 80,
      height: 80,
      backgroundColor: '#EA580C',
      border: '0px solid transparent',
      x: '-50%',
      y: '-50%',
      scale: isClicking && !prefersReducedMotion ? 0.9 : 1,
      opacity: 0.9,
    },
    drag: {
      width: 60,
      height: 60,
      backgroundColor: '#EA580C',
      border: '0px solid transparent',
      x: '-50%',
      y: '-50%',
      scale: isClicking && !prefersReducedMotion ? 0.9 : 1,
      opacity: 0.9,
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center overflow-hidden"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      variants={variants}
      initial="default"
      animate={cursorType}
      transition={{ type: 'tween', duration: 0.15 }}
    >
      {/* Content for card hover */}
      {cursorType === 'card' && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xs font-bold pointer-events-none"
        >
          View
        </motion.span>
      )}
      {/* Content for drag hover */}
      {cursorType === 'drag' && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xs font-bold pointer-events-none"
        >
          Grab
        </motion.span>
      )}
    </motion.div>
  );
}
