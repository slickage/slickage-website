import type { ReactNode } from 'react';
import Link from 'next/link';

interface TrackedFAQLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TrackedFAQLink({ href, children, className }: TrackedFAQLinkProps) {

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
