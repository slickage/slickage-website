import React from 'react';
import { ArrowRight, Globe, Smartphone, Server, Code, Database, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  techStack: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, techStack }) => {
  return (
    <div className="group">
      <div className="h-full relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-900/80">
        <div className="p-6 h-full flex flex-col">
          <div className="rounded-lg bg-blue-500/10 w-12 h-12 flex items-center justify-center mb-5">
            <div className="text-blue-400">{icon}</div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-gray-400 mb-6">{description}</p>
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-gray-800 text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
            <Button variant="transparent">
              Learn more
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ServicesSection() {
  const services = [
    {
      title: 'Distributed Systems',
      description:
        'Building scalable, reliable distributed systems that handle millions of concurrent connections.',
      icon: <Server className="h-6 w-6" />,
      techStack: ['Kubernetes', 'Docker', 'gRPC', 'Redis', 'Kafka'],
    },
    {
      title: 'Real-time Applications',
      description: 'Developing high-performance real-time applications with WebRTC and WebSocket.',
      icon: <Globe className="h-6 w-6" />,
      techStack: ['WebRTC', 'WebSocket', 'Node.js', 'React', 'TypeScript'],
    },
    {
      title: 'Mobile Development',
      description: 'Creating cross-platform mobile applications with native performance.',
      icon: <Smartphone className="h-6 w-6" />,
      techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    },
    {
      title: 'Backend Architecture',
      description: 'Designing robust backend systems with microservices architecture.',
      icon: <Code className="h-6 w-6" />,
      techStack: ['Go', 'Rust', 'Node.js', 'PostgreSQL', 'MongoDB'],
    },
    {
      title: 'Data Engineering',
      description: 'Building data pipelines and analytics systems for large-scale data processing.',
      icon: <Database className="h-6 w-6" />,
      techStack: ['Apache Spark', 'Airflow', 'Python', 'Elasticsearch'],
    },
    {
      title: 'Security Solutions',
      description: 'Implementing robust security measures and encryption protocols.',
      icon: <Lock className="h-6 w-6" />,
      techStack: ['OAuth', 'JWT', 'SSL/TLS', 'End-to-end Encryption'],
    },
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400 font-medium mb-4">
            Our Expertise
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Technical Solutions</h2>
          <p className="text-xl text-gray-400">
            We specialize in building complex systems that scale. Our expertise spans across
            multiple domains and technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              techStack={service.techStack}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
