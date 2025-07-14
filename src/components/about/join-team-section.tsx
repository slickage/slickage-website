import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function JoinTeamSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-2">
              Join Our Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
              We're always looking for talented people
            </h2>
            <p className="text-gray-300 text-lg">
              If you're passionate about technology and want to work on exciting projects with a
              great team, we'd love to hear from you.
            </p>
            <div className="pt-4">
              <button className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 flex items-center justify-center group">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/10 bg-white/5">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Join Our Team"
              width={600}
              height={600}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
