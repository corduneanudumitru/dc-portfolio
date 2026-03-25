'use client';

import { useLocale } from '@/i18n/LocaleContext';
import type { TranslationKey } from '@/i18n/translations';

interface TranslatedTextProps {
  tKey: TranslationKey;
  fallback?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export default function T({ tKey, fallback, as: Tag = 'span', className }: TranslatedTextProps) {
  const { t } = useLocale();
  const text = t(tKey) || fallback || '';
  return <Tag className={className}>{text}</Tag>;
}
