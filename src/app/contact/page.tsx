'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message! I'll get back to you soon.',
        });
        setFormData({ name: '', email: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setStatus({ type: 'idle' }), 5000);
      } else {
        setStatus({
          type: 'error',
          message: 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <main className="pt-20 sm:pt-24">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-b border-border">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl">
          Have a project in mind? Want to collaborate? I'd love to hear from you.
        </p>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
          {/* Contact information */}
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-text mb-8">
              Let's Connect
            </h3>

            <div className="space-y-8">
              <div>
                <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
                  Email
                </p>
                <a
                  href="mailto:hello@dcphotography.com"
                  className="text-base sm:text-lg text-text hover:text-accent transition-colors"
                >
                  hello@dcphotography.com
                </a>
              </div>

              <div>
                <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
                  Follow
                </p>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg text-text hover:text-accent transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg text-text hover:text-accent transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg text-text hover:text-accent transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-medium text-accent uppercase tracking-wider mb-3">
                  Response Time
                </p>
                <p className="text-base sm:text-lg text-text">
                  I typically respond within 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Status messages */}
              {status.type === 'success' && (
                <div className="p-4 bg-accent/10 border border-accent text-accent text-sm rounded">
                  {status.message}
                </div>
              )}

              {status.type === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded">
                  {status.message}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="w-full px-8 py-4 bg-accent text-bg text-base font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status.type === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border bg-surface">
        <div className="max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-text mb-4">
            Before You Go
          </h3>
          <p className="text-base text-muted leading-relaxed mb-6">
            Here are a few things that help me understand your project better:
          </p>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="text-accent flex-shrink-0">•</span>
              <span>What type of project are you interested in?</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent flex-shrink-0">•</span>
              <span>When are you looking to start?</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent flex-shrink-0">•</span>
              <span>What's your approximate budget or timeline?</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent flex-shrink-0">•</span>
              <span>Any specific style or reference images you have in mind?</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Back link */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Link href="/" className="text-sm text-accent hover:text-accent/80 transition-colors">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
