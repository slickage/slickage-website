'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollPosition } from '@/lib/hooks/useScrollPosition';
import Link from 'next/link';

export default function HeroSection() {
  const { scrollY } = useScrollPosition();

  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0" />
        <div
          className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg')] opacity-5 bg-cover bg-center bg-no-repeat mix-blend-overlay"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
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
              <Button className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 flex items-center justify-center group">
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
