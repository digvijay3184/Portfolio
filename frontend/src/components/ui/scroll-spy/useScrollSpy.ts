import { useState, useEffect } from 'react';
import { Home, User, Lightbulb, Briefcase, FolderKanban, Network, Mail } from 'lucide-react';

export const sectionData: Record<string, { label: string, icon: React.ComponentType<{ className?: string }> }> = {
  hero: { label: 'Hero', icon: Home },
  about: { label: 'About', icon: User },
  mindset: { label: 'Engineering Mindset', icon: Lightbulb },
  experience: { label: 'Experience', icon: Briefcase },
  projects: { label: 'Projects', icon: FolderKanban },
  architecture: { label: 'Architecture', icon: Network },
  contact: { label: 'Contact', icon: Mail },
};

export interface Section {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function useScrollSpy(sectionOrder?: string[]) {
  const [activeId, setActiveId] = useState('hero');
  const [activeSections, setActiveSections] = useState<Section[]>([]);

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

  return { activeId, activeSections };
}
