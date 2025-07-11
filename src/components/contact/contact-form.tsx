'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/5 rounded-xl">
      <CardContent className="p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Contact Us</h2>
          <p className="text-gray-400">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
            <p className="text-green-700 mb-4">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="text-green-700 border-green-300 hover:bg-green-50"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(808) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Your Company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectType" className="text-white">
                  Project Type
                </Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleSelectChange('projectType', value)}
                >
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="enterprise">Enterprise Solution</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-white">
                  Budget Range
                </Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => handleSelectChange('budget', value)}
                >
                  <SelectTrigger id="budget">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-10k">Less than $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="more-100k">More than $100,000</SelectItem>
                    <SelectItem value="not-sure">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">
                Project Details
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us about your project and requirements..."
                value={formData.message}
                onChange={handleChange}
                className="min-h-[150px]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
