import { ArrowRight } from 'lucide-react';

export default function ServiceCTA() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
            Ready to start your project?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 md:text-lg">
            Let's discuss how we can help you achieve your business goals with our software
            development expertise.
          </p>
          <div className="pt-4">
            <button className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 flex items-center justify-center group">
              Contact Us Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
