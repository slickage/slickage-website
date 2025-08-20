'use client';

import React from 'react';
import Link from 'next/link';
import { useEventTracking } from '@/lib/hooks/useEventTracking';

interface NavigationItem {
  name: string;
  href: string;
}

interface TrackedNavigationProps {
  items: NavigationItem[];
  context: string;
  className?: string;
}

export default function TrackedNavigation({ items, context, className = '' }: TrackedNavigationProps) {
  const { trackNavigation } = useEventTracking();

  return (
    <>
      {items.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            onClick={() => trackNavigation(item.name, item.href, context)}
            className={className}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </>
  );
}
