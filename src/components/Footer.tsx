'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/sanity/lib/queries';
import { useLocale } from '@/i18n/LocaleContext';

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterSettings {
  contactEmail?: string;
  footerText?: string;
  socialLinks?: SocialLink[];
}

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-accent/20 mt-20 sm:mt-32">
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 mb-12 sm:mb-16">
          <div className="col-span-1">
            <Link href="/" className="text-2xl sm:text-3xl font-serif font-bold mb-4 block hover:text-accent text-accent">DC</Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-6">{t('footer.navigate')}</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted hover:text-accent transition-colors">{t('footer.home')}</Link></li>
              <li><Link href="/work" className="text-sm text-muted hover:text-accent transition-colors">{t('nav.work')}</Link></li>
              <li><Link href="/journal" className="text-sm text-muted hover:text-accent transition-colors">{t('nav.journal')}</Link></li>
              <li><Link href="/about" className="text-sm text-muted hover:text-accent transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/contact" className="text-sm text-muted hover:text-accent transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-6">{t('footer.connect')}</h3>
            {!isLoading && settings.socialLinks && settings.socialLinks.length > 0 ? (
              <ul className="space-y-3">
                {settings.socialLinks.map((link) => (
                  <li key={link.platform}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors capitalize">{link.platform}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors">Instagram</a></li>
              </ul>
            )}
          </div>
        </div>
        <div className="border-t border-accent/20 my-8 sm:my-12" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted">{settings.footerText || `© ${currentYear} DC Photography. All rights reserved.`}</p>
          <p className="text-xs sm:text-sm text-muted/50">{t('footer.crafted')}</p>
        </div>
      </div>
    </footer>
  );
}
