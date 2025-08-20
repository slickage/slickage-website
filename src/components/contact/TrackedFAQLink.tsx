'use client';

import React from 'react';
import Link from 'next/link';
import { useEventTracking } from '@/lib/hooks/useEventTracking';

interface TrackedFAQLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function TrackedFAQLink({ href, children, className }: TrackedFAQLinkProps) {
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
