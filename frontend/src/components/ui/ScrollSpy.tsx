'use client';

import { useState, useEffect } from 'react';

const sectionLabels: Record<string, string> = {
  hero: 'Hero',
  about: 'About',
  mindset: 'Engineering Mindset',
  experience: 'Experience',
  projects: 'Projects',
  architecture: 'Architecture',
  contact: 'Contact',
};

export default function ScrollSpy({ sectionOrder }: { sectionOrder?: string[] }) {
  const [activeId, setActiveId] = useState('hero');
  const [activeSections, setActiveSections] = useState<{id: string, label: string}[]>([]);

  useEffect(() => {
    // Timeout to ensure DOM nodes are painted since some sections load asynchronously
    const timeout = setTimeout(() => {
      const defaultOrder = ['hero', 'about', 'mindset', 'experience', 'projects', 'architecture', 'contact'];
      const order = sectionOrder?.length ? sectionOrder : defaultOrder;
      
      const exists = order.map(id => ({ id, label: sectionLabels[id] || id }))
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
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 hidden lg:flex">
      {activeSections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 relative group ${
            activeId === id ? 'bg-[#EA580C] scale-125' : 'bg-[#333333] hover:bg-[#666666]'
          }`}
          data-cursor="button"
          aria-label={`Scroll to ${label}`}
        >
          <span className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#121212] border border-[#222222] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
