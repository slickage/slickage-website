import ContactHero from '@/components/contact/contact-hero';
import ContactForm from '@/components/contact/contact-form';
import ContactInfo from '@/components/contact/contact-info';
import FaqSection from '@/components/contact/faq-section';
import FaqPreview from '@/components/contact/faq-preview';
import AnimatedSection from '@/components/ui/animated-section';

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
    <main className="flex-1">
      <AnimatedSection variant="slideUp">
        <ContactHero />
      </AnimatedSection>

      <AnimatedSection variant="slideUp">
        <FaqPreview />
      </AnimatedSection>

      <AnimatedSection variant="slideUp">
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
      </AnimatedSection>

      <div className="text-center py-12 text-gray-500">
        <div className="animate-bounce">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
        <p className="text-sm mt-3 text-gray-400">More helpful information below</p>
      </div>

      <div id="faq">
        <AnimatedSection variant="slideUp">
          <FaqSection />
        </AnimatedSection>
      </div>
    </main>
  );
}
