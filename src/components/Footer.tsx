'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/sanity/lib/queries';

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
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 mb-12 sm:mb-16">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link href="/" className="text-2xl sm:text-3xl font-serif font-bold mb-4 block hover:text-accent text-accent">
              DC
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Fine art photography exploring light, composition, and the human
              experience across the globe.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-6">
              Navigate
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-sm text-muted hover:text-accent transition-colors">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-sm text-muted hover:text-accent transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-6">
              Connect
            </h3>
            {!isLoading && settings.socialLinks && settings.socialLinks.length > 0 ? (
              <ul className="space-y-3">
                {settings.socialLinks.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-accent transition-colors capitalize"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-accent/20 my-8 sm:my-12" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted">
            {settings.footerText ||
              `© ${currentYear} DC Photography. All rights reserved.`}
          </p>
          <p className="text-xs sm:text-sm text-muted/50">
            Crafted with attention to detail
          </p>
        </div>
      </div>
    </footer>
  );
}
