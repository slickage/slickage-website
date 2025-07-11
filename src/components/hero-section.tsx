'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
        <div
          className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg')] opacity-5 bg-cover bg-center bg-no-repeat mix-blend-overlay"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="max-w-4xl">
          {/* <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-6">
            Software Engineering Team
          </div> */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 gradient-text">
            Building the future of software engineering
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-10">
            A small team of passionate engineers crafting elegant solutions to complex problems. We
            specialize in distributed systems, real-time applications, and scalable architectures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 flex items-center justify-center group">
              View Our Work
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            {/* <button className="px-6 py-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-all duration-300">
              Read Documentation
            </button> */}
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
// return (
//   <section className="relative">
//     <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10"></div>
//     <div className="absolute inset-0">
//       <Image
//         src="/placeholder.svg?height=1080&width=1920"
//         alt="Hero background"
//         fill
//         className="object-cover"
//         priority
//       />
//     </div>
//     <div className="container relative z-20 py-24 md:py-32 lg:py-40">
//       <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
//         <div className="space-y-2">
//           <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white">
//             We build amazing experiences
//           </h1>
//           <p className="mx-auto max-w-[700px] text-lg text-gray-300 md:text-xl">
//             A boutique software company based in Honolulu, Hawaii building big things.
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-3 min-[400px]:flex-row">
//           <Button className="bg-red-600 hover:bg-red-700 text-white">
//             Our Services
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>
//           <Button variant="outline" className="text-black border-white hover:bg-white/10">
//             Get in Touch
//           </Button>
//         </div>
//       </div>
//     </div>
//   </section>
// )
// }
