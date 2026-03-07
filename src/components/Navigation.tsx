'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNavigation } from '@/sanity/lib/queries';

interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  order?: number;
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch navigation from Sanity
  useEffect(() => {
    async function fetchNav() {
      try {
        const data = await getNavigation();
        if (data?.items) {
          setNavItems(data.items);
        } else {
          // Fallback navigation
          setNavItems([
            { label: 'Work', href: '#work' },
            { label: 'Journal', href: '/journal' },
            { label: 'About', href: '/about' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch navigation:', error);
        // Fallback navigation
        setNavItems([
          { label: 'Work', href: '#work' },
          { label: 'Journal', href: '/journal' },
          { label: 'About', href: '/about' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNav();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-bg/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-serif font-bold hover:text-accent"
          >
            DC
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {!isLoading &&
              navItems.map((item) => (
                <div key={item.label}>
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-accent transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm font-medium hover:text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

            {/* Contact CTA Button */}
            <Link
              href="/contact"
              className="px-6 py-2 border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-bg transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-6 bg-text transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-text transition-all duration-300 ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-text transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-bg/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-8 top-20">
            {!isLoading &&
              navItems.map((item) => (
                <div key={item.label}>
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl font-serif hover:text-accent transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-2xl font-serif hover:text-accent transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

            {/* Mobile Contact CTA */}
            <Link
              href="/contact"
              className="px-8 py-3 border border-accent text-accent text-lg font-serif hover:bg-accent hover:text-bg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
