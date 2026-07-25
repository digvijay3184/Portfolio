'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import WorkTree from './WorkTree';
import { WorkNode } from '@/lib/tree/buildTree';

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  location?: string;
  workTree?: WorkNode[];
}

interface ExperienceTreeModalProps {
  experience: Experience | null;
  onClose: () => void;
}

export default function ExperienceTreeModal({ experience, onClose }: ExperienceTreeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Trap focus (simple implementation)
  useEffect(() => {
    if (experience && modalRef.current) {
      modalRef.current.focus();
    }
  }, [experience]);

  if (!experience) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ stiffness: 300, damping: 30 }}
          className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-[#0A0A0A] border border-[#222222] rounded-2xl shadow-2xl overflow-hidden outline-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[#222222] bg-[#121212]">
            <div>
              <h2 className="text-2xl font-bold text-white">{experience.role}</h2>
              <div className="text-[#EA580C] font-medium mt-1">
                {experience.company}
              </div>
              <div className="text-sm text-[#9CA3AF] mt-1">
                {formatDate(experience.startDate)} — {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                {experience.location && ` • ${experience.location}`}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#9CA3AF] hover:text-white rounded-full hover:bg-[#222] transition-colors"
              aria-label="Close modal"
              data-cursor="button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
            <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">
              Work Breakdown
            </h3>
            <WorkTree nodes={experience.workTree || []} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
