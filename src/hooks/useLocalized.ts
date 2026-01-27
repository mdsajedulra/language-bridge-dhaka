import { useTranslation } from 'react-i18next';

type Language = 'en' | 'bn' | 'zh';

export const useLocalized = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.substring(0, 2) || 'en') as Language;

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

  const getLocalizedArray = <T extends Record<string, unknown>>(
    item: T,
    fieldPrefix: string
  ): string[] => {
    const enKey = `${fieldPrefix}_en` as keyof T;
    const bnKey = `${fieldPrefix}_bn` as keyof T;
    const zhKey = `${fieldPrefix}_zh` as keyof T;
    
    const enArr = item[enKey] as string[] | null;
    const bnArr = item[bnKey] as string[] | null;
    const zhArr = item[zhKey] as string[] | null;
    
    if (lang === 'bn' && bnArr && bnArr.length > 0) return bnArr;
    if (lang === 'zh' && zhArr && zhArr.length > 0) return zhArr;
    return enArr || [];
  };

  return { lang, getLocalizedText, getLocalizedField, getLocalizedArray };
};
