'use client';

import * as React from 'react';

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = React.useState<string>(sectionIds[0] ?? '');

  React.useEffect(() => {
    if (!sectionIds.length) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.12, 0.2, 0.35, 0.5, 0.7],
        rootMargin: '-30% 0px -55% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds.join('|')]);

  return activeId;
}
