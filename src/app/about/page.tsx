'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAboutPage } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/client';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import { useLocale } from '@/i18n/LocaleContext';

interface Exhibition {
  title: string;
  venue: string;
  year: number;
}

interface Equipment {
  name: string;
  description?: string;
}

interface AboutData {
  portrait?: any;
  title?: string;
  bio?: any;
  shortBio?: string;
  equipment?: Equipment[];
  exhibitions?: Exhibition[];
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData>({});
  const [isLoading, setIsLoading] = useState(true);
  const { locale, t } = useLocale();

  useEffect(() => {
    async function fetchAbout() {
      try {
        const data = await getAboutPage();
        setAboutData(data || {});
      } catch (error) {
        console.error('Failed to fetch about page:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">{t('loading')}</p>
      </div>
    );
  }

  const portraitUrl = aboutData.portrait
    ? urlFor(aboutData.portrait).width(1200).url()
    : null;

  const romanianBio = t('about.bio.ro');
  const showRomanianBio = locale === 'ro' && romanianBio;

  return (
    <div className="pt-20 sm:pt-24">
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-b border-border">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text">
          {t('about.title')}
        </h1>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-start">
          <div className="relative w-full bg-surface border border-border overflow-hidden">
            {portraitUrl ? (
              <Image src={portraitUrl} alt="Dumitru Corduneanu" width={1200} height={800} className="w-full h-auto" />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center">
                <div className="text-center"><div className="text-6xl text-muted/30">📷</div></div>
              </div>
            )}
          </div>

          <div>
            {aboutData.title && (
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-6">{aboutData.title}</h2>
            )}

            {showRomanianBio ? (
              <p className="text-base sm:text-lg text-text leading-relaxed mb-6">{romanianBio}</p>
            ) : (
              <>
                {aboutData.shortBio && (
                  <p className="text-base sm:text-lg text-text leading-relaxed mb-6">{aboutData.shortBio}</p>
                )}
                {aboutData.bio && <PortableTextRenderer blocks={aboutData.bio} className="mb-8" />}
              </>
            )}
          </div>
        </div>
      </div>

      {aboutData.equipment && aboutData.equipment.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border">
          <div className="max-w-4xl">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-8">{t('about.equipment')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {aboutData.equipment.map((item, index) => (
                <div key={index} className="border-l-2 border-accent pl-6 py-2">
                  <h4 className="text-base sm:text-lg font-serif font-bold text-text mb-2">{item.name}</h4>
                  {item.description && <p className="text-sm sm:text-base text-muted">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aboutData.exhibitions && aboutData.exhibitions.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border">
          <div className="max-w-4xl">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-8">{t('about.exhibitions')}</h3>
            <div className="space-y-8">
              {aboutData.exhibitions.map((exhibition, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-text mb-1">{exhibition.title}</h4>
                    <p className="text-sm sm:text-base text-muted">{exhibition.venue}</p>
                  </div>
                  <p className="text-sm text-muted/70 flex-shrink-0">{exhibition.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border bg-surface">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-4">{t('about.workTogether')}</h3>
          <p className="text-base sm:text-lg text-muted mb-8">{t('about.workTogetherDesc')}</p>
          <a href="/contact" className="inline-block px-8 py-3 bg-accent text-bg text-sm font-medium hover:bg-accent/90 transition-colors">
            {t('about.contactMe')}
          </a>
        </div>
      </div>
    </div>
  );
}
