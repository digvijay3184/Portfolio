'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, LogOut, User, FileText, Image, Briefcase, Mail, Lightbulb, Network, Settings, Menu, X } from 'lucide-react';
import { api } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import GlobalCVUploader from '@/components/admin/GlobalCVUploader';
import { Dock, DockItem, DockIcon, DockLabel } from '@/components/core/dock';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('accessToken');
    if (!token && !pathname.includes('/login')) {
      router.push('/system-console/login');
    }
  }, [pathname, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (e) {}
    localStorage.removeItem('accessToken');
    router.push('/system-console/login');
  };

  if (!isMounted) return null;

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
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Dock Sidebar */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex">
        <Dock position="left">
          {navItems.map((item) => {
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
        </Dock>
      </div>

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] border-r border-[#222222] flex flex-col transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#222222]">
          <h1 className="text-white font-bold tracking-wider">SYSTEM CONSOLE</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-[#9CA3AF] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-[#EA580C]/10 text-[#EA580C]' 
                    : 'hover:bg-[#222222] hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#222222]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-[#222222] hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 w-full">
        <header className="h-16 bg-[#121212] border-b border-[#222222] flex items-center justify-between px-4 md:pr-8 md:pl-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-[#9CA3AF] hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-white font-medium hidden sm:block">Dashboard Overview</h2>
          </div>
          <GlobalCVUploader />
        </header>
        <div className="flex-1 overflow-auto p-4 md:pr-8 md:pl-36 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
