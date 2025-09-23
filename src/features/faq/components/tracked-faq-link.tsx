import Link from 'next/link';

interface TrackedFaqLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackedFAQLink({ href, children, className }: TrackedFaqLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
