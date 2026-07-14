// Lingue del sito. Prefisso sempre presente: /it, /en.
// Per un sito solo-italiano lascia solo 'it' qui: il routing resta identico
// (una lingua sola) senza toccare il resto del codice.
export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'it';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Antepone la lingua corrente ai link interni.
// I link nel CMS si scrivono locale-agnostici ("/about", "about"):
//   localizeHref("/about", "it") -> "/it/about"
//   localizeHref("/", "it")      -> "/it"
// Link esterni / ancore / mailto restano invariati.
export function localizeHref(url: string, locale: Locale): string {
  if (!url) return `/${locale}`;
  if (/^(https?:)?\/\//.test(url) || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }
  // già prefissato con una lingua valida? lascialo
  const seg = url.replace(/^\//, '').split('/')[0];
  if (isLocale(seg)) return url.startsWith('/') ? url : `/${url}`;

  const clean = url.startsWith('/') ? url : `/${url}`;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}
