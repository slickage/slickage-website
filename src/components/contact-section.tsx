'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            {/* <div>
              <div className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400 font-medium mb-4">
                Get in Touch
              </div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                Let's discuss your project
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                We'd love to hear from you. Fill out the form and our team will get back to you as
                soon as possible.
              </p>

              {/* <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/10 text-blue-400">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-gray-400">hello@archipelago.dev</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/10 text-blue-400">
                      <Phone className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">Phone</h3>
                    <p className="text-gray-400">+1 (808) 555-0123</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/10 text-blue-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">Location</h3>
                    <p className="text-gray-400">Honolulu, Hawaii</p>
                  </div>
                </div>
              </div> 
            </div> */}

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
