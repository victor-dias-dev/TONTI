export const DEFAULT_LOCALE = 'pt-BR' as const;
export const DEFAULT_CURRENCY = 'BRL' as const;

export const SUPPORTED_LOCALES = ['pt-BR', 'en-US', 'es'] as const;
export const SUPPORTED_CURRENCIES = ['BRL', 'USD', 'EUR'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
