'use client';

import type { ElementType } from 'react';
import { useLocale } from '@/i18n/LocaleContext';
import type { TranslationKey } from '@/i18n/translations';

interface TranslatedTextProps {
  tKey: TranslationKey;
  fallback?: string;
  as?: ElementType;
  className?: string;
}

export default function T({ tKey, fallback, as: Tag = 'span', className }: TranslatedTextProps) {
  const { t } = useLocale();
  const text = t(tKey) || fallback || '';
  return <Tag className={className}>{text}</Tag>;
}
