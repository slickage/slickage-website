import { SocialButtons } from '@/features/layout/components/social-buttons';
import { Fragment } from 'react';
import Link from 'next/link';

export function Footer() {
  const companyNavigation = [
    { name: 'Insights', href: '/#insights' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const legalNavigation = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
  ];

  return (
    <footer className="bg-gray-900 text-white min-h-[400px] contain-layout">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 min-h-[200px]">
          <div className="col-span-1 md:col-span-1 md:col-start-1 md:col-end-2 min-h-[200px]">
            <h3 className="text-2xl font-bold mb-6">Slickage</h3>
            <p className="text-gray-400 mb-6">
              A boutique software company based in Honolulu, Hawaii building big things.
            </p>
            <div className="min-h-[60px]">
              <SocialButtons />
            </div>
          </div>

          <div className="md:text-right md:col-span-1 md:col-start-6 md:col-end-7 min-h-[200px]">
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-4 min-h-[80px]">
              {companyNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 min-h-[80px]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2025 Slickage. All rights reserved.
            </p>
            <div className="flex space-x-6 min-h-[24px]">
              {legalNavigation.map((item, index) => (
                <Fragment key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-blue-400 text-sm">
                    {item.name}
                  </Link>
                  {index < legalNavigation.length - 1 && <span className="mx-6"></span>}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
