'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, LogOut, User, FileText, Image, Briefcase, Mail, Lightbulb, Network, Settings, Menu, X, MoreHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import GlobalCVUploader from '@/components/admin/GlobalCVUploader';
import { Dock, DockItem, DockIcon, DockLabel } from '@/components/core/dock';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/system-console', icon: LayoutDashboard },
  { name: 'Hero', href: '/system-console/hero', icon: User },
  { name: 'About', href: '/system-console/about', icon: FileText },
  { name: 'Mindset', href: '/system-console/mindset', icon: Lightbulb },
  { name: 'Experience', href: '/system-console/experience', icon: Briefcase },
  { name: 'Projects', href: '/system-console/projects', icon: Image },
  { name: 'Architecture', href: '/system-console/architecture', icon: Network },
  { name: 'Messages', href: '/system-console/messages', icon: Mail },
  { name: 'Settings', href: '/system-console/settings', icon: Settings },
];

export default function SystemConsoleLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMoreMenuOpen) {
      moreTriggerRef.current?.focus();
      return;
    }

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

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('accessToken');
    if (!token && !pathname.includes('/login')) {
      router.push('/system-console/login');
    }
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (e) {}
    localStorage.removeItem('accessToken');
    router.push('/system-console/login');
  };

  if (!isMounted) return null;

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

  if (pathname.includes('/login')) {
    return (
      <>
        {children}
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#121212', color: '#fff', border: '1px solid #333' } }} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex text-[#9CA3AF]">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#121212', color: '#fff', border: '1px solid #333' } }} />
      
      {/* Responsive Dock Sidebar */}
      <div className="fixed bottom-6 md:bottom-auto left-1/2 md:left-6 md:top-1/2 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 z-50 max-w-[calc(100vw-1rem)]">
        <Dock position={isMobile ? 'bottom' : 'left'} className="w-auto overflow-x-auto md:overflow-visible justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.slice(0, isMobile ? 4 : undefined).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <DockItem
                key={item.name}
                isActive={isActive}
                aria-label={`Navigate to ${item.name}`}
                data-cursor="button"
                onClick={() => router.push(item.href)}
              >
                <DockLabel>{item.name}</DockLabel>
                <DockIcon>
                  <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-[#EA580C]' : 'text-[#9CA3AF]'}`} />
                </DockIcon>
              </DockItem>
            );
          })}

          {isMobile && (
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
              <DockLabel>More</DockLabel>
              <DockIcon>
                <MoreHorizontal className={`w-5 h-5 transition-colors duration-300 ${isMoreMenuOpen ? 'text-[#EA580C]' : 'text-[#9CA3AF]'}`} />
              </DockIcon>
            </DockItem>
          )}

          {!isMobile && (
            <>
              <div className="w-full h-px bg-[#222222] my-1 rounded-full" />
              <DockItem
                isActive={false}
                aria-label="Logout"
                data-cursor="button"
                onClick={handleLogout}
              >
                <DockLabel>Logout</DockLabel>
                <DockIcon>
                  <LogOut className="w-5 h-5 text-red-500/80 transition-colors duration-300" />
                </DockIcon>
              </DockItem>
            </>
          )}
        </Dock>
      </div>

      {/* Mobile More Options Menu */}
      <AnimatePresence>
        {isMobile && isMoreMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMoreMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="system-console-more-menu"
              ref={moreMenuRef}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-28 left-4 right-4 z-50 bg-[#121212] border border-[#222222] rounded-2xl p-2 shadow-2xl flex flex-col gap-1"
              role="dialog"
              aria-modal="true"
              aria-label="More navigation options"
              tabIndex={-1}
              onKeyDown={handleMoreMenuKeyDown}
            >
              <div className="grid grid-cols-2 gap-2">
                {navItems.slice(4).map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        router.push(item.href);
                      }}
                      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${isActive ? 'bg-[#EA580C]/10 text-[#EA580C] border border-[#EA580C]/20' : 'text-[#9CA3AF] hover:bg-[#222222] hover:text-white border border-transparent'}`}
                    >
                      <Icon size={18} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="w-full h-px bg-[#222222] my-2" />
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-3 w-full p-3 rounded-xl text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 w-full">
        <header className="h-16 bg-[#121212] border-b border-[#222222] flex items-center justify-between px-4 md:pr-8 md:pl-8">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-medium">Dashboard Overview</h2>
          </div>
          <GlobalCVUploader />
        </header>
        <div className="flex-1 overflow-auto p-4 pb-24 md:pb-8 md:pr-8 md:pl-36 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
