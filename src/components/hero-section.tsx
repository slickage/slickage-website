'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950/20 to-violet-950/20" />
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
              We're a lean software engineering company based in Honolulu, Hawaii, creating exceptional
              digital products for partners worldwide.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#insights">
              <Button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                View Our Work
                <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-1.5 h-16 rounded-full bg-gray-700/50 backdrop-blur-sm">
          <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
