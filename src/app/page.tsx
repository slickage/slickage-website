import HeroSection from '@/components/hero-section';
import ProjectsSection from '@/components/projects-section';
import FeaturesSection from '@/components/features-section';
import ContactSection from '@/components/contact-section';

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
