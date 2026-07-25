'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { Search, FolderGit2, Mail, FileText, Terminal } from 'lucide-react';

export default function CommandMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-lg bg-[#121212] border border-[#222222] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <Command
          className="w-full flex flex-col bg-transparent"
        >
          <div className="flex items-center border-b border-[#222222] px-3">
            <Search className="w-5 h-5 text-[#9CA3AF] shrink-0" />
            <Command.Input 
              autoFocus
              className="w-full h-12 bg-transparent border-none text-white px-3 focus:outline-none focus:ring-0 placeholder:text-[#9CA3AF]"
              placeholder="Type a command or search..." 
            />
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-[#9CA3AF]">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-[#9CA3AF] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[#6B7280]">
              <Command.Item 
                onSelect={() => {
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-[#EA580C]/20 hover:text-[#EA580C] aria-selected:bg-[#EA580C]/20 aria-selected:text-[#EA580C] transition-colors"
              >
                <FolderGit2 className="w-4 h-4" /> Go to Projects
              </Command.Item>
              <Command.Item 
                onSelect={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-[#EA580C]/20 hover:text-[#EA580C] aria-selected:bg-[#EA580C]/20 aria-selected:text-[#EA580C] transition-colors"
              >
                <Mail className="w-4 h-4" /> Contact Me
              </Command.Item>
              <Command.Item 
                onSelect={() => {
                  // Will tie this into actual global CV later or route to a page
                  window.open('/', '_blank'); 
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-[#EA580C]/20 hover:text-[#EA580C] aria-selected:bg-[#EA580C]/20 aria-selected:text-[#EA580C] transition-colors"
              >
                <FileText className="w-4 h-4" /> View Resume
              </Command.Item>
            </Command.Group>

            <Command.Group heading="System" className="px-2 py-1.5 text-xs font-medium text-[#9CA3AF] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[#6B7280]">
              <Command.Item 
                onSelect={() => {
                  window.location.href = '/system-console';
                }}
                className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-[#EA580C]/20 hover:text-[#EA580C] aria-selected:bg-[#EA580C]/20 aria-selected:text-[#EA580C] transition-colors"
              >
                <Terminal className="w-4 h-4" /> System Console
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
