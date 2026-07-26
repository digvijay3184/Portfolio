import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dock, DockItem, DockIcon, DockLabel } from '@/components/core/dock';
import { Section } from './useScrollSpy';

interface MobileScrollSpyProps {
  activeId: string;
  activeSections: Section[];
}

export function MobileScrollSpy({ activeId, activeSections }: MobileScrollSpyProps) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isMoreMenuOpen) {
      if (wasOpenRef.current) {
        moreTriggerRef.current?.focus();
        wasOpenRef.current = false;
      }
      return;
    }

    wasOpenRef.current = true;
    const firstFocusable = moreMenuRef.current?.querySelector<HTMLElement>(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    (firstFocusable ?? moreMenuRef.current)?.focus();
  }, [isMoreMenuOpen]);

  useEffect(() => {
    if (!isMoreMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMoreMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMoreMenuOpen]);

  const handleMoreMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return;
    }

    const focusables = Array.from(
      moreMenuRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
    );

    if (!focusables.length) {
      event.preventDefault();
      moreMenuRef.current?.focus();
      return;
    }

    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable || document.activeElement === moreMenuRef.current) {
        event.preventDefault();
        lastFocusable.focus();
      }
      return;
    }

    if (document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  };

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMoreMenuOpen(false);
  };

  const visibleItems = activeSections.slice(0, 4);
  const moreItems = activeSections.slice(4);

  return (
    <>
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)]">
        <Dock position="bottom" className="w-auto overflow-x-auto justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {visibleItems.map(({ id, label, icon: Icon }) => (
            <DockItem
              key={id}
              isActive={activeId === id}
              aria-label={`Scroll to ${label}`}
              data-cursor="button"
              onClick={() => handleScroll(id)}
            >
              <DockLabel>{label}</DockLabel>
              <DockIcon>
                <Icon className={`w-5 h-5 transition-colors duration-300 ${activeId === id ? 'text-[#EA580C]' : 'text-neutral-400 group-active:text-white'}`} />
              </DockIcon>
            </DockItem>
          ))}

          {moreItems.length > 0 && (
            <DockItem
              ref={moreTriggerRef}
              isActive={isMoreMenuOpen}
              aria-label="More options"
              aria-haspopup="dialog"
              aria-expanded={isMoreMenuOpen}
              aria-controls="scrollspy-more-menu"
              data-cursor="button"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            >
              <DockLabel>More</DockLabel>
              <DockIcon>
                <MoreHorizontal className={`w-5 h-5 transition-colors duration-300 ${isMoreMenuOpen ? 'text-[#EA580C]' : 'text-neutral-400 group-active:text-white'}`} />
              </DockIcon>
            </DockItem>
          )}
        </Dock>
      </div>

      <AnimatePresence>
        {isMoreMenuOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMoreMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="scrollspy-more-menu"
              ref={moreMenuRef}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 left-4 right-4 max-w-sm mx-auto z-50 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl origin-bottom"
              role="dialog"
              aria-modal="true"
              aria-label="More navigation options"
              tabIndex={-1}
              onKeyDown={handleMoreMenuKeyDown}
            >
              <div className="grid grid-cols-2 gap-3">
                {moreItems.map(({ id, label, icon: Icon }) => {
                  const isActive = activeId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleScroll(id)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/30 shadow-[0_0_15px_rgba(234,88,12,0.15)]' 
                          : 'text-[#a1a1a1] active:bg-white/10 border border-transparent'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
