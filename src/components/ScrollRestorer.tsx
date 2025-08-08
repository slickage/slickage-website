'use client';

import { useEffect } from 'react';

export default function ScrollRestorer() {
  useEffect(() => {
    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    } catch {}

    const nav = (performance.getEntriesByType('navigation')[0] || null) as
      | PerformanceNavigationTiming
      | null;
    const isReload = nav?.type === 'reload';

    const storageKey = 'scroll-restorer:y';

    const save = () => {
      try {
        sessionStorage.setItem(storageKey, String(window.scrollY));
      } catch {}
    };

    window.addEventListener('beforeunload', save);

    const restoreOnce = () => {
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (!raw) return;
        const y = Number(raw);
        if (!Number.isNaN(y) && y > 0) {
          const html = document.documentElement as HTMLElement;
          const prev = html.style.scrollBehavior;
          html.style.scrollBehavior = 'auto';
          window.scrollTo(0, y);
          html.style.scrollBehavior = prev;
        }
      } catch {}
    };

    if (isReload) {
      let attempts = 0;
      const maxAttempts = 15;
      const tick = () => {
        restoreOnce();
        attempts += 1;
        if (attempts < maxAttempts) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      window.addEventListener('load', restoreOnce);
    }

    return () => {
      window.removeEventListener('beforeunload', save);
      window.removeEventListener('load', restoreOnce);
    };
  }, []);

  return null;
}


