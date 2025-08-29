import { Fragment } from 'react';
import Link from 'next/link';

interface LegalLinksProps {
  items: { name: string; href: string }[];
}

export function LegalLinks({ items }: LegalLinksProps) {

  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.name}>
          <Link href={item.href} className="text-gray-300 hover:text-blue-400 text-sm">
            {item.name}
          </Link>
          {index < items.length - 1 && <span className="mx-6"></span>}
        </Fragment>
      ))}
    </>
  );
}
