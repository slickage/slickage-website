import HeroSection from '@/components/hero-section';
import InsightsSection from '@/components/insights-section';
import FeaturesSection from '@/components/features-section';
import ContactSection from '@/components/contact-section';
import AnimatedSection from '@/components/ui/animated-section';

export default function Home() {
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
