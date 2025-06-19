import React from 'react';
import { CheckCircle, Clock, Users, Zap, Layers, Shield } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Rapid Development',
      description: 'We leverage modern development practices and tools to deliver high-quality solutions quickly.'
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Code Quality',
      description: 'Rigorous testing, code reviews, and automated CI/CD ensure exceptional code quality.'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Collaborative Development',
      description: 'Our engineers work closely with your team to ensure seamless integration and knowledge transfer.'
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Performance Optimization',
      description: 'We build systems that scale, with a focus on latency, throughput, and resource efficiency.'
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: 'Modern Architecture',
      description: 'Cloud-native, containerized solutions designed for reliability and scalability.'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Security First',
      description: 'Built-in security at every layer, from infrastructure to application code.'
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400 font-medium mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Engineering Excellence
          </h2>
          <p className="text-xl text-gray-400">
            Our commitment to quality and engineering best practices sets us apart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400">
                  {feature.icon}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};