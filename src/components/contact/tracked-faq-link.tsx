'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';

interface TrackedFAQLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TrackedFAQLink({ href, children, className }: TrackedFAQLinkProps) {
  const { trackNavigation } = useEventTracking();

  const handleClick = () => {
    trackNavigation('View All FAQ', href, 'faq_preview');
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
