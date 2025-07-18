import React from 'react';
import { CheckCircle, Clock, Users, Zap, Layers, Shield } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Web Applications',
      description:
        'The backbone of modern business. We craft custom web applications using the right technology for your needs-whether JavaScript frameworks (Node.js, Vue.js, React, Angular), Ruby on Rails, Elixir/Phoenix, or Go. Every application is handcrafted to solve your specific challenges and scale with your growth.',
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'iOS Development',
      description:
        'Bring your vision to life on iPhone and iPad. We handle everything from initial design to App Store submission, plus ongoing user engagement through smart notifications. Built with Swift and Objective-C expertise you can trust.',
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Product Design & Development',
      description:
        "Great software starts with great design. We create user experiences that feel intuitive and help people achieve their goals effortlessly. Whether you're building from scratch or improving an existing product, we'll streamline your application for maximum impact.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Modernizing Legacy Applications',
      description:
        'Got an aging application that needs new life? We assess your current system and create a clear roadmap for upgrades, performance improvements, and long-term maintenance.',
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: 'Knowledge Transfer',
      description:
        "Your success shouldn't depend on us forever. We train your team to maintain and deploy your applications independently, sharing our tools, processes, and expertise so you can confidently manage your digital products.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'DevOps & Infrastructure',
      description:
        'From deployment pipelines to cloud architecture, we ensure your applications run smoothly and scale seamlessly.',
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl leading-[1.1] font-bold mb-4 gradient-text">
            What we do
          </h2>
          <p className="text-xl text-gray-400">We can help you build amazing products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex">
              {/* <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400">
                  {feature.icon}
                </div>
              </div> */}
              <div className="">
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
