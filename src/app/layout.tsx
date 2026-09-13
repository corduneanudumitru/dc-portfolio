import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import './portfolio.css';
import {getLocale} from '@/portfolio/locale';
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
  metadataBase: new URL('https://dumitrucorduneanu.com'),
  title: {
    default: 'Dumitru Corduneanu | Documentary & Fine-Art Photography',
    template: '%s | Dumitru Corduneanu',
  },
  description:
    'Documentary and fine-art photography of people, ritual, and place — from the highlands of Ethiopia to the markets of Kathmandu.',
  robots: process.env.NEXT_PUBLIC_SITE_PREVIEW === 'true' ? {index:false,follow:false} : undefined,
  keywords: [
    'documentary photography',
    'fine art photography',
    'travel photography',
    'portrait photography',
    'Dumitru Corduneanu',
    'Lalibela',
    'Bhutan',
    'Nepal',
    'Peru',
  ],
  authors: [{ name: 'Dumitru Corduneanu' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dumitrucorduneanu.com',
    siteName: 'Dumitru Corduneanu Photography',
    title: 'Dumitru Corduneanu | Documentary & Fine-Art Photography',
    description:
      'Documentary and fine-art photography of people, ritual, and place.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dumitru Corduneanu | Documentary & Fine-Art Photography',
    description:
      'Documentary and fine-art photography of people, ritual, and place.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale=await getLocale();
  const preview=process.env.NEXT_PUBLIC_SITE_PREVIEW === "true";
  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        {!preview && <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8BVD8ZZGDN"
          strategy="afterInteractive"
        />}
        {!preview && <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8BVD8ZZGDN');
          `}
        </Script>}
      </head>
      <body className="antialiased">
        <LocaleProvider initialLocale={locale}>
          <Navigation />
          <main id="main" tabIndex={-1} className="wrap">{children}</main>
          <Footer />
        </LocaleProvider>
        {!preview && <Analytics />}
        {!preview && <SpeedInsights />}
      </body>
    </html>
  );
}
