import HeroSection from '@/components/hero-section';
import ProjectsSection from '@/components/projects-section';
import FeaturesSection from '@/components/features-section';
import ContactSection from '@/components/contact-section';

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
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
