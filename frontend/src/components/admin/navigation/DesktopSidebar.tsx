import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Dock, DockItem, DockIcon, DockLabel } from '@/components/core/dock';
import { navItems } from './nav-items';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface DesktopSidebarProps {
  pathname: string;
}

export function DesktopSidebar({ pathname }: DesktopSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (e) {}
    localStorage.removeItem('accessToken');
    router.push('/system-console/login');
  };

  return (
    <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <Dock position="left" className="w-auto overflow-visible justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navItems.map((item) => {
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
                  <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-[#EA580C]' : 'text-neutral-400 group-hover:text-white'}`} />
                </DockIcon>
              </div>
            </DockItem>
          );
        })}

        <div className="w-full h-px bg-[#222222] my-2" />
        
        <DockItem
          aria-label="Logout"
          data-cursor="pointer"
          onClick={handleLogout}
        >
          <div className="w-full h-full flex items-center justify-center relative p-3">
            <DockLabel>Logout</DockLabel>
            <DockIcon>
              <LogOut className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors duration-300" />
            </DockIcon>
          </div>
        </DockItem>
      </Dock>
    </div>
  );
}
