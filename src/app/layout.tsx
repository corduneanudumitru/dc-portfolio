import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { LocaleProvider } from '@/i18n/LocaleContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'DC Photography | Fine Art Photography Portfolio',
  description:
    'Contemporary photography exploring light, composition, and human connection across the globe.',
  keywords: [
    'photography',
    'fine art',
    'portrait',
    'landscape',
    'travel',
    'street photography',
  ],
  authors: [{ name: 'DC' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dumitrucorduneanu.com',
    title: 'DC Photography | Fine Art Photography Portfolio',
    description:
      'Contemporary photography exploring light, composition, and human connection across the globe.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DC Photography',
    description: 'Contemporary photography portfolio',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8BVD8ZZGDN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8BVD8ZZGDN');
          `}
        </Script>
      </head>
      <body className="bg-bg text-text font-sans antialiased">
        <LocaleProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
