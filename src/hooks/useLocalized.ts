import { useTranslation } from 'react-i18next';

type Language = 'en' | 'bn' | 'zh';

export const useLocalized = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en') as Language;

  const getLocalizedText = (
    en?: string | null,
    bn?: string | null,
    zh?: string | null
  ): string => {
    if (lang === 'bn' && bn) return bn;
    if (lang === 'zh' && zh) return zh;
    return en || '';
  };

  const getLocalizedField = <T extends Record<string, unknown>>(
    item: T,
    fieldPrefix: string
  ): string => {
    const enKey = `${fieldPrefix}_en` as keyof T;
    const bnKey = `${fieldPrefix}_bn` as keyof T;
    const zhKey = `${fieldPrefix}_zh` as keyof T;
    
    return getLocalizedText(
      item[enKey] as string | null,
      item[bnKey] as string | null,
      item[zhKey] as string | null
    );
  };

  return { lang, getLocalizedText, getLocalizedField };
};
