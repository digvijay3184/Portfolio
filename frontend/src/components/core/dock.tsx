'use client';

import React, { createContext, useContext, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type SpringOptions, type MotionValue } from 'framer-motion';

type DockContextType = {
  mousePos: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
  panelHeight: number;
  position: 'left' | 'right' | 'bottom';
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
  position?: 'left' | 'right' | 'bottom';
}

export function Dock({
  children,
  className = '',
  spring = { mass: 0.1, stiffness: 300, damping: 30 },
  magnification = 80,
  distance = 150,
  panelHeight = 48,
  position = 'right',
}: DockProps) {
  const mousePos = useMotionValue(Infinity);

  const isBottom = position === 'bottom';
  const alignmentClass = position === 'right' ? 'items-end' : position === 'left' ? 'items-start' : 'items-center';
  const flexDir = isBottom ? 'flex-row' : 'flex-col';
  const wrapperStyle = isBottom ? { height: panelHeight + 16 } : { width: panelHeight + 16 };

  return (
    <DockContext.Provider value={{ mousePos, spring, magnification, distance, panelHeight, position }}>
      <motion.div
        onMouseMove={(e) => mousePos.set(isBottom ? e.clientX : e.clientY)}
        onMouseLeave={() => mousePos.set(Infinity)}
        className={`flex ${flexDir} ${alignmentClass} justify-center gap-2 rounded-2xl bg-[#121212]/80 backdrop-blur-md border border-[#222222] p-2 ${className}`}
        style={wrapperStyle}
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
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  'aria-label'?: string;
  'data-cursor'?: string;
  isActive?: boolean;
}

export const DockItem = forwardRef<HTMLButtonElement, DockItemProps>(function DockItem(
  { 
    children, 
    className = '', 
    onClick, 
    'aria-label': ariaLabel,
    'data-cursor': dataCursor,
    isActive = false 
  },
  ref,
) {
  const { mousePos, spring, magnification, distance, panelHeight, position } = useDock();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement, []);
  
  const isBottom = position === 'bottom';

  const distanceCalc = useTransform(mousePos, (val: number) => {
    const bounds = buttonRef.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    return isBottom 
      ? val - bounds.x - bounds.width / 2
      : val - bounds.y - bounds.height / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [panelHeight, magnification, panelHeight]
  );

  const width = useSpring(widthSync, spring);
  const indicatorClass = position === 'right' ? '-right-1.5 top-1/2 -translate-y-1/2' 
                       : position === 'left' ? '-left-1.5 top-1/2 -translate-y-1/2' 
                       : '-bottom-1.5 left-1/2 -translate-x-1/2';

  return (
    <motion.button
      ref={buttonRef}
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
        <span className={`absolute ${indicatorClass} w-1.5 h-1.5 rounded-full bg-[#EA580C]`} />
      )}
    </motion.button>
  );
});

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
    ? 'right-[calc(100%+12px)] top-1/2 -translate-y-1/2 translate-x-2 group-hover:translate-x-0 group-focus-visible:translate-x-0' 
    : position === 'left'
    ? 'left-[calc(100%+12px)] top-1/2 -translate-y-1/2 -translate-x-2 group-hover:translate-x-0 group-focus-visible:translate-x-0'
    : 'bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 translate-y-2 group-hover:translate-y-0 group-focus-visible:translate-y-0';

  return (
    <span 
      className={`absolute px-2.5 py-1 bg-[#121212] border border-[#222222] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-lg z-50 ${positionClass} ${className}`}
    >
      {children}
    </span>
  );
}
