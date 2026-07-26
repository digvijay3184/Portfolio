import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dock, DockItem, DockIcon, DockLabel } from '@/components/core/dock';
import { navItems } from './nav-items';
import { api } from '@/lib/api';

interface MobileDockProps {
  pathname: string;
}

export function MobileDock({ pathname }: MobileDockProps) {
  const router = useRouter();
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
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
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
      moreMenuRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') ?? [],
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

  const handleLogout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (e) {}
    localStorage.removeItem('accessToken');
    router.push('/system-console/login');
  };

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)]">
        <Dock position="bottom" className="w-auto overflow-x-auto justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <DockItem
                key={item.name}
                isActive={isActive}
                aria-label={item.name}
                data-cursor="pointer"
                onClick={() => router.push(item.href)}
              >
                <div className="w-full h-full flex items-center justify-center relative p-3">
                  <DockLabel>{item.name}</DockLabel>
                  <DockIcon>
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-[#EA580C]' : 'text-neutral-400 group-active:text-white'}`} />
                  </DockIcon>
                </div>
              </DockItem>
            );
          })}

          <DockItem
            ref={moreTriggerRef}
            isActive={isMoreMenuOpen}
            aria-label="More options"
            aria-haspopup="dialog"
            aria-expanded={isMoreMenuOpen}
            aria-controls="system-console-more-menu"
            data-cursor="button"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          >
            <div className="w-full h-full flex items-center justify-center relative p-3">
              <DockLabel>More</DockLabel>
              <DockIcon>
                <MoreHorizontal className={`w-5 h-5 transition-colors duration-300 ${isMoreMenuOpen ? 'text-[#EA580C]' : 'text-neutral-400 group-active:text-white'}`} />
              </DockIcon>
            </div>
          </DockItem>
        </Dock>
      </div>

      <AnimatePresence>
        {isMoreMenuOpen && (
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMoreMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="system-console-more-menu"
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
                {navItems.slice(4).map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/30 shadow-[0_0_15px_rgba(234,88,12,0.15)]' 
                          : 'text-white active:bg-white/10 border border-transparent'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                
                <div className="col-span-2 h-px bg-[#222222] my-1" />
                
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    handleLogout();
                  }}
                  className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl text-red-500 active:bg-red-500/10 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
