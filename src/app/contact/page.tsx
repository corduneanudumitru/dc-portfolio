'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  subject: string;
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
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message! I will get back to you soon.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus({ type: 'idle' }), 5000);
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <main className="pt-20 sm:pt-24">
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-b border-border">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl">
          Have a project in mind or want to collaborate? Fill out the form below and I will get back to you within 24-48 hours.
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text mb-2">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">Subject</label>
              <select id="subject" name="subject" value={formData.subject} onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border border-border text-text focus:outline-none focus:border-accent transition-colors">
                <option value="">Select a topic</option>
                <option value="collaboration">Collaboration</option>
                <option value="print">Print Purchase</option>
                <option value="commission">Commission</option>
                <option value="press">Press / Media</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text mb-2">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6}
                className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="Tell me about your project or inquiry..." />
            </div>

            {status.type === 'success' && (
              <div className="p-4 bg-accent/10 border border-accent text-accent text-sm">{status.message}</div>
            )}
            {status.type === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500 text-red-400 text-sm">{status.message}</div>
            )}

            <button type="submit" disabled={status.type === 'loading'}
              className="w-full px-8 py-4 bg-accent text-bg text-base font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {status.type === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Link href="/" className="text-sm text-accent hover:text-accent/80 transition-colors">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
