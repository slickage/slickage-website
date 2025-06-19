'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  techStack: string[];
}

export default function Projects() {
  const projects: Project[] = [
    {
      id: 1,
      title: 'Distributed Video Conferencing',
      category: 'WebRTC',
      description: 'A scalable video conferencing solution handling 100k+ concurrent users.',
      imageUrl: 'https://images.pexels.com/photos/6266227/pexels-photo-6266227.jpeg',
      techStack: ['WebRTC', 'Go', 'React', 'Redis', 'Kubernetes']
    },
    {
      id: 2,
      title: 'Real-time Analytics Platform',
      category: 'Data Engineering',
      description: 'Processing millions of events per second with sub-second latency.',
      imageUrl: 'https://images.pexels.com/photos/6633920/pexels-photo-6633920.jpeg',
      techStack: ['Kafka', 'Rust', 'ClickHouse', 'GraphQL']
    },
    {
      id: 3,
      title: 'Cloud Infrastructure Manager',
      category: 'DevOps',
      description: 'Automated cloud infrastructure management and deployment platform.',
      imageUrl: 'https://images.pexels.com/photos/6956800/pexels-photo-6956800.jpeg',
      techStack: ['Terraform', 'AWS', 'Docker', 'TypeScript']
    },
    {
      id: 4,
      title: 'Secure Messaging System',
      category: 'Security',
      description: 'End-to-end encrypted messaging with perfect forward secrecy.',
      imageUrl: 'https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg',
      techStack: ['Signal Protocol', 'Rust', 'React Native', 'PostgreSQL']
    }
  ];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'WebRTC', 'Data Engineering', 'DevOps', 'Security'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400 font-medium mb-4">
            Our Work
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Technical Projects
          </h2>
          <p className="text-xl text-gray-400">
            Explore our latest work in distributed systems and scalable applications.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group rounded-xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-400 font-medium mb-2">{project.category}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, index) => (
                    <span key={index} className="px-2 py-1 text-xs font-medium rounded-md bg-gray-800 text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="flex items-center text-blue-400 font-medium text-sm group">
                  View Project
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 inline-flex items-center group">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};