'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 hover:border-blue-500/50 transition-all duration-300 text-center max-w-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Send className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Let's build something together
              </h3>
              <p className="text-gray-400 mb-6">
                Our contact form is coming soon, but we're always ready to discuss new projects.
                Whether you have a detailed brief or just an idea, we'd love to hear from you.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Reach out to us on LinkedIn and let's get the conversation started.
              </p>
              <div className="flex justify-center">
                <a
                  href="https://linkedin.com/company/slickage-studios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-300 group"
                >
                  <FaLinkedin className="h-5 w-5 mr-2" />
                  Message us on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
