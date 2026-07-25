'use client';

import { useState, useEffect } from 'react';
import { Home, User, Lightbulb, Briefcase, FolderKanban, Network, Mail } from 'lucide-react';
import { Dock, DockItem, DockLabel, DockIcon } from '@/components/core/dock';

const sectionData: Record<string, { label: string, icon: React.ElementType }> = {
  hero: { label: 'Hero', icon: Home },
  about: { label: 'About', icon: User },
  mindset: { label: 'Engineering Mindset', icon: Lightbulb },
  experience: { label: 'Experience', icon: Briefcase },
  projects: { label: 'Projects', icon: FolderKanban },
  architecture: { label: 'Architecture', icon: Network },
  contact: { label: 'Contact', icon: Mail },
};

export default function ScrollSpy({ sectionOrder }: { sectionOrder?: string[] }) {
  const [activeId, setActiveId] = useState('hero');
  const [activeSections, setActiveSections] = useState<{id: string, label: string, icon: React.ElementType}[]>([]);

  useEffect(() => {
    // Timeout to ensure DOM nodes are painted since some sections load asynchronously
    const timeout = setTimeout(() => {
      const defaultOrder = ['hero', 'about', 'mindset', 'experience', 'projects', 'architecture', 'contact'];
      const order = sectionOrder?.length ? sectionOrder : defaultOrder;
      
      const exists = order
        .map(id => ({ 
          id, 
          label: sectionData[id]?.label || id,
          icon: sectionData[id]?.icon || Home
        }))
        .filter(({ id }) => document.getElementById(id));
      
      setActiveSections(exists);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '-30% 0px -70% 0px' }
      );

      exists.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [sectionOrder]);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex">
      <Dock>
        {activeSections.map(({ id, label, icon: Icon }) => (
          <DockItem
            key={id}
            isActive={activeId === id}
            aria-label={`Scroll to ${label}`}
            data-cursor="button"
            onClick={() => {
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <DockLabel>{label}</DockLabel>
            <DockIcon>
              <Icon className={`w-5 h-5 transition-colors duration-300 ${activeId === id ? 'text-[#EA580C]' : 'text-[#9CA3AF]'}`} />
            </DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
