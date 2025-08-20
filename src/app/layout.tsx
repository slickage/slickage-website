import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { LazyMotionWrapper } from '@/components/ui/LazyMotionWrapper';
import { PostHogProvider } from './providers';
import { PageTracker } from '../components/PageTracker';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Preload critical resources for better LCP performance */}
        <link
          rel="preload"
          href="/logo-slickage-lines-blue-light.svg"
          as="image"
          type="image/svg+xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-gradient-to-r from-blue-500/10 to-violet-500/10`}>
        <PostHogProvider>
          <PageTracker />
          <LazyMotionWrapper>
            <Header />
            {children}
            <Footer />
          </LazyMotionWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}
