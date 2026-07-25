'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type SpringOptions, type MotionValue } from 'framer-motion';

type DockContextType = {
  mouseY: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
  panelHeight: number;
  position: 'left' | 'right';
};

const DockContext = createContext<DockContextType | null>(null);

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a Dock component');
  }
  return context;
}

export interface DockProps {
  children: React.ReactNode;
  className?: string;
  spring?: SpringOptions;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  position?: 'left' | 'right';
}

export function Dock({
  children,
  className = '',
  spring = { mass: 0.1, stiffness: 300, damping: 30 }, // Snappy, < 600ms constraints
  magnification = 80, // Increased to make the magnification effect highly visible
  distance = 150,
  panelHeight = 48, // Reduced base size for better contrast
  position = 'right',
}: DockProps) {
  const mouseY = useMotionValue(Infinity);

  const alignmentClass = position === 'right' ? 'items-end' : 'items-start';

  return (
    <DockContext.Provider value={{ mouseY, spring, magnification, distance, panelHeight, position }}>
      <motion.div
        onMouseMove={(e) => mouseY.set(e.clientY)}
        onMouseLeave={() => mouseY.set(Infinity)}
        className={`flex flex-col ${alignmentClass} justify-center gap-2 rounded-2xl bg-[#121212]/80 backdrop-blur-md border border-[#222222] p-2 ${className}`}
        style={{ width: panelHeight + 16 }} // Lock the border strictly to the base size so items burst OUT of it
        role="navigation"
        aria-label="Primary Dock Navigation"
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export interface DockItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
  'data-cursor'?: string;
  isActive?: boolean;
}

export function DockItem({ 
  children, 
  className = '', 
  onClick, 
  'aria-label': ariaLabel,
  'data-cursor': dataCursor,
  isActive = false 
}: DockItemProps) {
  const { mouseY, spring, magnification, distance, panelHeight, position } = useDock();
  const ref = useRef<HTMLButtonElement>(null);

  const distanceCalc = useTransform(mouseY, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [panelHeight, magnification, panelHeight]
  );

  const width = useSpring(widthSync, spring);
  const dotClass = position === 'right' ? '-right-3' : '-left-3';

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={onClick}
      className={`relative group flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] ${
        isActive ? 'bg-[#222222]/80' : 'hover:bg-[#222222]/50'
      } ${className}`}
      aria-label={ariaLabel}
      data-cursor={dataCursor}
    >
      {children}
      {isActive && (
        <span className={`absolute ${dotClass} top-1/2 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-[#EA580C]`} />
      )}
    </motion.button>
  );
}

export function DockIcon({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      {children}
    </div>
  );
}

export function DockLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { position } = useDock();
  
  const positionClass = position === 'right' 
    ? 'right-[calc(100%+12px)] translate-x-2 group-hover:translate-x-0 group-focus-visible:translate-x-0' 
    : 'left-[calc(100%+12px)] -translate-x-2 group-hover:translate-x-0 group-focus-visible:translate-x-0';

  return (
    <span 
      className={`absolute top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#121212] border border-[#222222] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-lg z-50 ${positionClass} ${className}`}
    >
      {children}
    </span>
  );
}
