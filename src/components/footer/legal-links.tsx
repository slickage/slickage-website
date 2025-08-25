'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';

interface LegalLinksProps {
  items: { name: string; href: string }[];
}

export function LegalLinks({ items }: LegalLinksProps) {
  const { trackNavigation } = useEventTracking();

  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.name}>
          <Link
            href={item.href}
            onClick={() => trackNavigation(item.name, item.href, 'footer_legal')}
            className="text-gray-300 hover:text-blue-400 text-sm"
          >
            {item.name}
          </Link>
          {index < items.length - 1 && <span className="mx-6"></span>}
        </Fragment>
      ))}
    </>
  );
}
