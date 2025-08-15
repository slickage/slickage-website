'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useScrollPosition } from '@/lib/hooks/useScrollPosition';

const HEADER_ITEMS = [''];

export default function Header() {
  const { isScrolled } = useScrollPosition({ threshold: 10 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent ${
        isScrolled
          ? 'xxbg-gradient-to-r from-blue-950/90 to-violet-950/90 bg-black/30 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold tracking-tight gradient-text">
              <Image
                src="/logo-slickage-lines-blue-light.svg"
                alt="Company Logo"
                width={150}
                height={64}
                priority
                className="h-5 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {HEADER_ITEMS.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                aria-label={item || 'Navigation link'}
              >
                {item}
              </Link>
            ))}
            <Link href="/contact">
              <Button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                Get in Touch
              </Button>
            </Link>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border-b border-gray-800"
          role="menu"
          aria-label="Mobile navigation"
        >
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {HEADER_ITEMS.map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link href="/contact">
                <Button
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
