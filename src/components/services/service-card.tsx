import type React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/5 rounded-xl">
      <CardHeader>
        <div className="rounded-full bg-blue-500/10 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">
          Our {title.toLowerCase()} services are designed to help businesses create exceptional
          digital experiences.
        </p>
      </CardContent>
      <CardFooter>
        <button className="flex items-center text-blue-400 hover:text-blue-500 font-medium transition-colors p-0 h-auto bg-transparent">
          Learn more <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </CardFooter>
    </Card>
  );
}
