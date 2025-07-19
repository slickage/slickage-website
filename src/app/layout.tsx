import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://beta.slickage.io'),
  title: 'Slickage - Software Development Company',
  description: 'A boutique software company based in Honolulu, Hawaii building big things.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-r from-blue-500/10 to-violet-500/10`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
