import { useEffect } from 'react';

export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);
};
