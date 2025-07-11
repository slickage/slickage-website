import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/5 rounded-xl">
      <CardContent className="pt-6">
        <div className="rounded-full bg-blue-500/10 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}
