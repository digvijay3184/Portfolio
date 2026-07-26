import { Dock, DockItem, DockLabel, DockIcon } from '@/components/core/dock';
import { Section } from './useScrollSpy';

interface DesktopScrollSpyProps {
  activeId: string;
  activeSections: Section[];
}

export function DesktopScrollSpy({ activeId, activeSections }: DesktopScrollSpyProps) {
  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50">
      <Dock position="right" className="w-auto overflow-visible justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
              <Icon className={`w-5 h-5 transition-colors duration-300 ${activeId === id ? 'text-[#EA580C]' : 'text-neutral-400 group-hover:text-white'}`} />
            </DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
