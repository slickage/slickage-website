'use client';

import React from 'react';
import { Handshake, Mail, MapPin } from 'lucide-react';
import ContactForm from './contact/contact-form';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-gray-800 p-8 hover:border-blue-500/50 transition-all duration-300">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="text-center lg:text-left lg:col-span-2">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Handshake className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Let's build something together
              </h3>
              <p className="text-gray-400 mb-6">
                We'd love to hear from you. Fill out the form and our team will get back to you as
                soon as possible.
              </p>

              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Email</p>
                      <a
                        href="mailto:inquiry@slickage.com"
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        inquiry@slickage.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-white text-sm font-medium">Address</p>
                      <div className="text-gray-400 text-sm">
                        <p>Slickage Studios, LLC</p>
                        <p>1600 Kapiolani Blvd., Ste. 1315</p>
                        <p>Honolulu, HI 96814</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:ml-8 lg:col-span-3">
              <div className="hidden lg:block absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
