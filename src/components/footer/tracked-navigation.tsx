'use client';

import Link from 'next/link';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';

interface NavigationItem {
  name: string;
  href: string;
}

interface TrackedNavigationProps {
  items: NavigationItem[];
  context: string;
  className?: string;
}

export function TrackedNavigation({ items, context, className = '' }: TrackedNavigationProps) {
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
