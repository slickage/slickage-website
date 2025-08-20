'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEventTracking } from '@/lib/hooks/useEventTracking';
import Link from 'next/link';

export default function HeroSection() {
  const { trackCTAClick } = useEventTracking();

  const handleViewWorkClick = () => {
    trackCTAClick('View Our Work', 'hero_section', '/#insights');
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-violet-500/10" />

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="max-w-5xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-8 gradient-text">
            We build software that works
          </h1>
          <div className="space-y-4 mb-12">
            <p className="text-xl md:text-2xl text-blue-100 font-medium leading-relaxed">
              Fast, reliable, and beautifully crafted.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl">
              We're a lean software engineering company based in Honolulu, Hawaii, creating
              exceptional digital products for partners worldwide.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#insights" onClick={handleViewWorkClick}>
              <Button
                variant="blue"
                size="lg"
                className="group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View Our Work
                <ArrowRight className="ml-3 h-5 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
