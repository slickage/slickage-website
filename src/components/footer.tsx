import React from 'react';
import { Linkedin, Github as GitHub } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-6">Slickage</h3>
            <p className="text-gray-400 mb-6">
              A boutique software company based in Honolulu, Hawaii building big things.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Linkedin className="h-5 w-5" />, href: '#' },
                { icon: <GitHub className="h-5 w-5" />, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 text-gray-400 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div></div>
          <div></div>
          <div></div>

          <div className="md:text-right">
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-4">
              {[
                'Web Development',
                'Mobile Development',
                'Backend Solutions',
                'Frontend Development',
                'Data Analytics',
                'Security Solutions',
              ].map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:text-right">
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Insights', 'Contact Us'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg w-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            <p className="text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div> */}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Slickage. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-gray-500 hover:text-blue-400 text-sm">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="text-gray-500 hover:text-blue-400 text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
