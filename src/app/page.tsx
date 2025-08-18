import HeroSection from '@/components/hero-section';
import InsightsSection from '@/components/insights-section';
import FeaturesSection from '@/components/features-section';
import ContactSection from '@/components/contact-section';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function Home() {
  return (
    <main className="flex-1 bg-gradient-to-r from-blue-500/10 to-violet-500/10">
      <AnimatedSection variant="fadeInUp" delay={0}>
        <HeroSection />
      </AnimatedSection>

      <AnimatedSection variant="fadeInUp" delay={0.1}>
        <FeaturesSection />
      </AnimatedSection>

      <AnimatedSection variant="fadeInUp" delay={0.2}>
        <InsightsSection />
      </AnimatedSection>

      <AnimatedSection variant="fadeInUp" delay={0.3}>
        <ContactSection />
      </AnimatedSection>
    </main>
  );
}
