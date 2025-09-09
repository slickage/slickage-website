import { HeroSection } from '@/features/home/components/hero-section';
import { InsightsSection } from '@/features/home/components/insights-section';
import { FeaturesSection } from '@/features/home/components/features-section';
import { ContactSection } from '@/features/home/components/contact-section';
import { AnimatedSection } from '@/components/animated-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slickage - Software Development Company',
  description: 'Slickage is a boutique software development company based in Honolulu, Hawaii. We specialize in web applications, iOS development, product design, and building innovative digital solutions for businesses worldwide.',
  openGraph: {
    title: 'Slickage - Software Development Company',
    description: 'Slickage is a boutique software development company based in Honolulu, Hawaii. We specialize in web applications, iOS development, product design, and building innovative digital solutions for businesses worldwide.',
  },
};

export default async function Home() {
  return (
    <main className="flex-1">
      <AnimatedSection variant="slideUp">
        <HeroSection />
      </AnimatedSection>

      <AnimatedSection variant="slideUp">
        <FeaturesSection />
      </AnimatedSection>

      <AnimatedSection variant="slideUp">
        <InsightsSection />
      </AnimatedSection>

      <AnimatedSection variant="slideUp">
        <ContactSection />
      </AnimatedSection>
    </main>
  );
}
