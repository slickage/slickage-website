import { ServicesHero, ServiceFeature, ServiceGrid, ServiceCta } from '@/components/services';

export const metadata = {
  title: 'Services | Slickage Software Development',
  description:
    'Discover the full range of software development services offered by Slickage, from web and mobile apps to cloud and security solutions.',
  openGraph: {
    title: 'Services | Slickage Software Development',
    description:
      'Discover the full range of software development services offered by Slickage, from web and mobile apps to cloud and security solutions.',
    url: 'https://slickage.com/services',
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
    title: 'Services | Slickage Software Development',
    description:
      'Discover the full range of software development services offered by Slickage, from web and mobile apps to cloud and security solutions.',
    images: ['/logo-slickage-lines-blue-light.svg'],
  },
};

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <ServicesHero />

      <ServiceFeature
        title="Web Development"
        description="Custom web applications that drive business growth"
        features={[
          'Progressive Web Applications (PWAs)',
          'E-commerce platforms',
          'Content Management Systems (CMS)',
          'Custom web portals and dashboards',
        ]}
        image="/placeholder.svg?height=600&width=600"
        imageAlt="Web Development"
      />

      <ServiceFeature
        title="Mobile Development"
        description="Native and cross-platform mobile applications"
        features={[
          'iOS app development',
          'Android app development',
          'Cross-platform development (React Native, Flutter)',
          'Mobile app maintenance and updates',
        ]}
        image="/placeholder.svg?height=600&width=600"
        imageAlt="Mobile Development"
        isReversed={true}
      />

      <ServiceGrid />
      <ServiceCta />
    </main>
  );
}
