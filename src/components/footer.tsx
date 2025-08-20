import React from 'react';
import SocialButtons from './footer/SocialButtons';
import TrackedNavigation from './footer/TrackedNavigation';
import LegalLinks from './footer/LegalLinks';

export default function Footer() {
  // Static navigation data - server-side safe
  const companyNavigation = [
    { name: 'Insights', href: '/#insights' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const legalNavigation = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          <div className="col-span-1 md:col-span-1 md:col-start-1 md:col-end-2">
            <h3 className="text-2xl font-bold mb-6">Slickage</h3>
            <p className="text-gray-400 mb-6">
              A boutique software company based in Honolulu, Hawaii building big things.
            </p>
            {/* Client component for interactive social buttons */}
            <SocialButtons />
          </div>

          <div className="md:text-right md:col-span-1 md:col-start-6 md:col-end-7">
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              {/* Client component for tracked navigation */}
              <TrackedNavigation
                items={companyNavigation}
                context="footer_navigation"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              />
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Slickage. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {/* Client component for tracked legal links */}
              <LegalLinks items={legalNavigation} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}