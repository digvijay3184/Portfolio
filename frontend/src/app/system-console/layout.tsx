'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, LogOut, User, FileText, Image, Briefcase, Mail, Lightbulb, Network, Settings } from 'lucide-react';
import { api } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import GlobalCVUploader from '@/components/admin/GlobalCVUploader';

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

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('accessToken');
    if (!token && !pathname.includes('/login')) {
      router.push('/system-console/login');
    }
  }, [pathname, router]);

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
      {/* Sidebar */}
      <aside className="w-64 bg-[#121212] border-r border-[#222222] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#222222]">
          <h1 className="text-white font-bold tracking-wider">SYSTEM CONSOLE</h1>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-[#121212] border-b border-[#222222] flex items-center justify-between px-8">
          <h2 className="text-white font-medium">Dashboard Overview</h2>
          <GlobalCVUploader />
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
