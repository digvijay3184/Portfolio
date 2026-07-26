'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import GlobalCVUploader from '@/components/admin/GlobalCVUploader';
import { DesktopSidebar } from '@/components/admin/navigation/DesktopSidebar';
import { MobileDock } from '@/components/admin/navigation/MobileDock';

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
      
      <DesktopSidebar pathname={pathname} />
      <MobileDock pathname={pathname} />

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
