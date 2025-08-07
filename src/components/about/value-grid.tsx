import { Award, Clock, Code, Heart, MapPin, Users } from 'lucide-react';
import ValueCard from './value-card';

export default function ValueGrid() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0"/>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-2">
            Our Values
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
            What drives us
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 md:text-lg">
            Our core values guide everything we do, from how we build software to how we interact
            with our clients.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ValueCard
            icon={<Code className="h-6 w-6 text-blue-500" />}
            title="Technical Excellence"
            description="We're committed to writing clean, maintainable code and staying at the forefront of technology."
          />
          <ValueCard
            icon={<Users className="h-6 w-6 text-blue-500" />}
            title="Collaborative Approach"
            description="We work closely with our clients, treating their projects as if they were our own."
          />
          <ValueCard
            icon={<Heart className="h-6 w-6 text-blue-500" />}
            title="Passion for Quality"
            description="We're passionate about creating software that not only works well but exceeds expectations."
          />
          <ValueCard
            icon={<Clock className="h-6 w-6 text-blue-500" />}
            title="Timely Delivery"
            description="We understand the importance of deadlines and strive to deliver projects on time, every time."
          />
          <ValueCard
            icon={<Award className="h-6 w-6 text-blue-500" />}
            title="Continuous Improvement"
            description="We're always learning, growing, and finding ways to improve our processes and skills."
          />
          <ValueCard
            icon={<MapPin className="h-6 w-6 text-blue-500" />}
            title="Local Roots, Global Reach"
            description="We're proud of our Hawaiian roots while serving clients around the world."
          />
        </div>
      </div>
    </section>
  );
}
