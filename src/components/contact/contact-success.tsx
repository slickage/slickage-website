'use client';

import { Button } from '@/components/ui/button';

interface ContactSuccessProps {
  onReset: () => void;
}

export function ContactSuccess({ onReset }: ContactSuccessProps) {
  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl border border-green-500/20 p-8 text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-500/30">
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
          className="h-8 w-8 text-green-400"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 gradient-text">
        Message Sent Successfully!
      </h3>
      <p className="text-gray-300 mb-6 leading-relaxed">
        Thank you for reaching out. We'll get back to you as soon as possible.
      </p>
      <Button onClick={onReset} variant="blue" size="lg">
        Send Another Message
      </Button>
    </div>
  );
}
