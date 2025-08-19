import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectCTA() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
            Have a project in mind?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 md:text-lg">
            Let's discuss how we can help you bring your ideas to life with our software development
            expertise.
          </p>
          <div className="pt-4">
            <Button variant="blueLight" size="xl" className="group">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
