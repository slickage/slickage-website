'use client';

import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollPosition } from '@/lib/hooks/useScrollPosition';
import Link from 'next/link';

export default function HeroSection() {
  const { scrollY } = useScrollPosition({ debounceMs: 16 }); // Optimize scroll performance

  // Memoize the transform calculation to prevent unnecessary recalculations
  const backgroundTransform = useMemo(() => {
    return `translateY(${scrollY * 0.1}px)`; // Reduce transform intensity
  }, [scrollY]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        {/* Simplified background - removed external image dependency */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-gray-900/30 to-violet-950/20" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-violet-500/5"
          style={{
            transform: backgroundTransform,
          }}
        />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 gradient-text">
            We build software that works
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-10">
            Fast, reliable, and beautifully crafted. We're a lean software engineering company based
            in Honolulu, Hawaii, creating exceptional digital products for partners worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#insights">
              <Button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center group">
                View Our Work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-1 h-12 rounded-full bg-gray-800">
          <div className="w-1 h-3 rounded-full bg-blue-500 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
