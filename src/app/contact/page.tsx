import { ContactHero, ContactForm, ContactInfo, FaqSection } from '@/components/contact';
import AnimatedSection from '@/components/ui/AnimatedSection';

export const metadata = {
  title: 'Contact Slickage | Get in Touch',
  description:
    'Contact Slickage to discuss your project, ask questions, or learn more about our software development services in Honolulu, Hawaii.',
  openGraph: {
    title: 'Contact Slickage | Get in Touch',
    description:
      'Contact Slickage to discuss your project, ask questions, or learn more about our software development services in Honolulu, Hawaii.',
    url: 'https://slickage.com/contact',
    type: 'website',
    images: [
      {
        url: '/logo-slickage-lines-blue-light.svg',
        width: 1200,
        height: 630,
        alt: 'Slickage Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Slickage | Get in Touch',
    description:
      'Contact Slickage to discuss your project, ask questions, or learn more about our software development services in Honolulu, Hawaii.',
    images: ['/logo-slickage-lines-blue-light.svg'],
  },
};

export default function ContactPage() {
  return (
    <main className="flex-1 bg-gradient-to-r from-blue-500/10 to-violet-500/10">
      <AnimatedSection variant="fadeInUp" delay={0}>
        <ContactHero />
      </AnimatedSection>

      <AnimatedSection variant="fadeInUp" delay={0.1}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ContactForm standalone={true} />
            </div>

            <div>
              <ContactInfo />
            </div>
          </div>
        </div>

        <FaqSection />
      </AnimatedSection>
    </main>
  );
}
