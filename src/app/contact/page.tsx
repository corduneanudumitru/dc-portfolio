'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/i18n/LocaleContext';

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
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const { t } = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading' });
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (response.ok) {
        setStatus({ type: 'success', message: t('contact.success') });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus({ type: 'idle' }), 5000);
      } else {
        setStatus({ type: 'error', message: t('contact.error') });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({ type: 'error', message: t('contact.errorSend') });
    }
  };

  return (
    <div className="pt-20 sm:pt-24">
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-b border-border">
        <div className="w-10 h-0.5 bg-accent mb-6" />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">{t('contact.title')}</h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl">{t('contact.desc')}</p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text mb-2">{t('contact.name')}</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors" placeholder={t('contact.namePlaceholder')} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">{t('contact.email')}</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">{t('contact.subject')}</label>
              <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-surface border border-border text-text focus:outline-none focus:border-accent transition-colors appearance-none">
                <option value="" disabled>{t('contact.selectSubject')}</option>
                <option value="collaboration">{t('contact.collaboration')}</option>
                <option value="print-purchase">{t('contact.printPurchase')}</option>
                <option value="commission">{t('contact.commission')}</option>
                <option value="press-media">{t('contact.pressMedia')}</option>
                <option value="other">{t('contact.other')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text mb-2">{t('contact.message')}</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full px-4 py-3 bg-surface border border-border text-text placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none" placeholder={t('contact.messagePlaceholder')} />
            </div>
            {status.type === 'success' && <div className="p-4 bg-accent/10 border border-accent text-accent text-sm">{status.message}</div>}
            {status.type === 'error' && <div className="p-4 bg-red-500/10 border border-red-500 text-red-400 text-sm">{status.message}</div>}
            <button type="submit" disabled={status.type === 'loading'} className="w-full px-8 py-4 bg-accent text-bg text-base font-medium hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {status.type === 'loading' ? t('contact.sending') : t('contact.send')}
            </button>
          </form>
          <p className="text-xs text-muted/60 mt-6 text-center">{t('contact.responseTime')}</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 text-center border-t border-border">
        <Link href="/" className="text-sm text-accent hover:text-accent/80 transition-colors">{t('contact.backHome')}</Link>
      </div>
    </div>
  );
}
