import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import ProjectsSection from "@/components/projects-section"
import FeaturesSection from "@/components/features-section"
import TestimonialsSection from "@/components/testimonials-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  )
}

