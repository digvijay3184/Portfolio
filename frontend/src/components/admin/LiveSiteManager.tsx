'use client';

import { useState, useEffect } from 'react';
import { useContent } from '@/lib/hooks/useContent';
import { GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_SECTIONS = [
  { id: 'about', label: 'About Section', key: 'showAboutSection' },
  { id: 'mindset', label: 'Mindset Section', key: 'showMindsetSection' },
  { id: 'experience', label: 'Experience Section', key: 'showExperienceSection' },
  { id: 'projects', label: 'Projects Section', key: 'showProjectsSection' },
  { id: 'architecture', label: 'Architecture Section', key: 'showArchitectureSection' },
  { id: 'contact', label: 'Contact Section', key: 'showContactSection' },
];

export default function LiveSiteManager() {
  const { data, isLoading, update, create } = useContent('site-settings');
  
  const [sections, setSections] = useState<any[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading) {
      const doc = data?.[0] || {};
      const order = doc.sectionOrder || ['hero', 'about', 'mindset', 'experience', 'projects', 'architecture', 'contact'];
      
      const mapped = order.map((id: string) => {
        if (id === 'hero') return { id: 'hero', label: 'Hero Section', visible: true, key: 'none' };
        
        const def = DEFAULT_SECTIONS.find(d => d.id === id);
        if (!def) return null;
        return {
          ...def,
          visible: doc[def.key] ?? true
        };
      }).filter(Boolean);
      
      setSections(mapped);
    }
  }, [data, isLoading]);

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragEnter = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    
    setSections(prev => {
      const newItems = [...prev];
      const draggedItem = newItems[draggedIdx];
      newItems.splice(draggedIdx, 1);
      newItems.splice(idx, 0, draggedItem);
      setDraggedIdx(idx);
      return newItems;
    });
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    
    const newOrder = sections.map(s => s.id);
    try {
      if (data?.[0]?._id) {
        await update({ 
          id: data[0]._id, 
          data: { sectionOrder: newOrder } 
        });
      } else {
        await create({ sectionOrder: newOrder });
      }
      toast.success('Layout saved!');
    } catch(e) {
      toast.error('Failed to save layout');
    }
  };

  const toggleVisibility = async (idx: number, currentVisible: boolean) => {
    const section = sections[idx];
    if (section.id === 'hero') return;

    const newVal = !currentVisible;
    
    setSections(prev => {
      const n = [...prev];
      n[idx].visible = newVal;
      return n;
    });

    try {
      if (data?.[0]?._id) {
        await update({
          id: data[0]._id,
          data: { [section.key]: newVal }
        });
      } else {
        await create({ [section.key]: newVal });
      }
    } catch(e) {
      toast.error("Failed to update visibility");
      setSections(prev => {
        const n = [...prev];
        n[idx].visible = currentVisible;
        return n;
      });
    }
  };

  if (isLoading) return <div className="h-40 animate-pulse bg-[#121212] rounded-xl border border-[#222222]"></div>;

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Live Site Manager</h3>
      <div className="bg-[#121212] border border-[#222222] rounded-xl p-4">
        <p className="text-sm text-[#9CA3AF] mb-4">Drag to reorder sections on the live portfolio. Toggle to hide them.</p>
        
        <div className="space-y-2">
          {sections.map((section, idx) => (
            <div 
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragEnter={() => handleDragEnter(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`flex items-center justify-between p-3 bg-[#050505] border border-[#222222] rounded-lg cursor-move transition-all ${draggedIdx === idx ? 'opacity-50 border-[#EA580C]' : 'hover:border-[#333333]'}`}
            >
              <div className="flex items-center gap-3 pointer-events-none">
                <GripVertical size={16} className="text-[#6B7280]" />
                <span className="text-sm font-medium text-white">{section.label}</span>
              </div>

              {section.id !== 'hero' ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={section.visible} 
                    onChange={() => toggleVisibility(idx, section.visible)} 
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-[#222222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EA580C]"></div>
                </label>
              ) : (
                <span className="text-xs text-[#6B7280] uppercase tracking-wider font-bold">Required</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
