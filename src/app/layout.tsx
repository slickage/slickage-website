import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Header } from '@/features/layout/components/header';
import { Footer } from '@/features/layout/components/footer';
import { PostHogProvider } from '@/app/_providers/posthog-provider';
import { AnalyticsConsentBanner } from '@/features/layout/components/analytics-consent-banner';
import { MotionWrapper } from '@/components/motion-wrapper';
import { getClientConfig } from '@/lib/client-config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://beta.slickage.io'),
  title: {
    default: 'Slickage - Software Development Company',
    template: '%s | Slickage',
  },
  description:
    'Slickage is a boutique software development company based in Honolulu, Hawaii. We specialize in web applications, iOS development, product design, and building innovative digital solutions for businesses worldwide.',
  keywords: [
    'software development',
    'web applications',
    'iOS development',
    'product design',
    'Hawaii',
    'Honolulu',
    'digital solutions',
    'custom software',
    'web development',
    'mobile apps',
  ],
  authors: [{ name: 'Slickage' }],
  creator: 'Slickage',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://beta.slickage.io',
    title: 'Slickage - Software Development Company',
    description:
      'Slickage is a boutique software development company based in Honolulu, Hawaii. We specialize in web applications, iOS development, product design, and building innovative digital solutions for businesses worldwide.',
    siteName: 'Slickage',
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
    title: 'Slickage - Software Development Company',
    description:
      'Slickage is a boutique software development company based in Honolulu, Hawaii. We specialize in web applications, iOS development, product design, and building innovative digital solutions for businesses worldwide.',
    images: ['/logo-slickage-lines-blue-light.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://beta.slickage.io',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.className}`}>
      <body>
        <PostHogProvider config={getClientConfig().posthog}>
          <MotionWrapper>
            <Header />
            {children}
            <Footer />
            <AnalyticsConsentBanner />
          </MotionWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}
