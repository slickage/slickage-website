import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ServiceFeatureProps {
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  isReversed?: boolean;
}

export default function ServiceFeature({
  title,
  description,
  features,
  image,
  imageAlt,
  isReversed = false,
}: ServiceFeatureProps) {
  return (
    <section className={`py-16 md:py-24 ${isReversed ? 'bg-gray-50 dark:bg-gray-900' : ''}`}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`${isReversed ? 'order-2 md:order-1' : ''}`}>
            {!isReversed && (
              <Image
                src={image || '/placeholder.svg'}
                alt={imageAlt}
                width={600}
                height={600}
                className="rounded-lg shadow-xl"
              />
            )}
            {isReversed && (
              <div className="space-y-6">
                <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">
                  {title}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{description}</h2>
                <p className="text-gray-500">
                  We develop high-performance solutions that engage users and drive results. Our
                  expertise includes:
                </p>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className={`${isReversed ? 'order-1 md:order-2' : ''}`}>
            {isReversed && (
              <Image
                src={image || '/placeholder.svg'}
                alt={imageAlt}
                width={600}
                height={600}
                className="rounded-lg shadow-xl"
              />
            )}
            {!isReversed && (
              <div className="space-y-6">
                <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">
                  {title}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{description}</h2>
                <p className="text-gray-500">
                  We build responsive, scalable solutions that provide exceptional user experiences.
                  Our services include:
                </p>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
