import HeroSection from '@/components/hero-section';
import InsightsSection from '@/components/insights-section';
import FeaturesSection from '@/components/features-section';
import ContactSection from '@/components/contact-section';
import ScrollToTopWrapper from '@/components/ScrollToTopWrapper';

export const metadata = {
  title: 'Slickage | Software Development Company in Honolulu, Hawaii',
  description:
    'Slickage is a boutique software company based in Honolulu, Hawaii, building innovative digital products for businesses worldwide.',
  openGraph: {
    title: 'Slickage | Software Development Company in Honolulu, Hawaii',
    description:
      'Slickage is a boutique software company based in Honolulu, Hawaii, building innovative digital products for businesses worldwide.',
    url: 'https://slickage.com/',
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
    title: 'Slickage | Software Development Company in Honolulu, Hawaii',
    description:
      'Slickage is a boutique software company based in Honolulu, Hawaii, building innovative digital products for businesses worldwide.',
    images: ['/logo-slickage-lines-blue-light.svg'],
  },
};

export default function Home() {
  return (
    <ScrollToTopWrapper>
      <main className="flex-1 bg-gradient-to-r from-blue-500/10 to-violet-500/10">
        <HeroSection />
        <FeaturesSection />
        <InsightsSection />
        <ContactSection />
      </main>
    </ScrollToTopWrapper>
  );
}
