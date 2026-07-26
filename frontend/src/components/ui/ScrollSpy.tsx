'use client';

import { useScrollSpy } from './scroll-spy/useScrollSpy';
import { DesktopScrollSpy } from './scroll-spy/DesktopScrollSpy';
import { MobileScrollSpy } from './scroll-spy/MobileScrollSpy';

export default function ScrollSpy({ sectionOrder }: { sectionOrder?: string[] }) {
  const { activeId, activeSections } = useScrollSpy(sectionOrder);

  if (!activeSections.length) return null;

  return (
    <>
      <DesktopScrollSpy activeId={activeId} activeSections={activeSections} />
      <MobileScrollSpy activeId={activeId} activeSections={activeSections} />
    </>
  );
}
