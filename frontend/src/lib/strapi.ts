import qs from 'qs';
import type {
  Page,
  Theme,
  Navigation,
  Header,
  Footer,
  StrapiMedia,
} from './types';
import type { Locale } from './i18n';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_API_TOKEN;

// Lo UID di Strapi non accetta "/": la home usa questo slug nel CMS,
// il frontend lo mappa alla root "/<locale>".
export const HOME_SLUG = 'home';

// populate per la dynamic zone: sintassi `on` di Strapi 5
const BLOCKS_POPULATE = {
  on: {
    'blocks.hero': { populate: '*' },
    'blocks.rich-text': { populate: '*' },
    'blocks.text-image': { populate: '*' },
    'blocks.cta': { populate: '*' },
    'blocks.banner': { populate: '*' },
  },
};

async function fetchAPI<T>(
  path: string,
  params: Record<string, unknown> = {},
  opts: { draft?: boolean } = {},
): Promise<T | null> {
  const query = qs.stringify(params, { encodeValuesOnly: true });
  const url = `${STRAPI_URL}/api/${path}${query ? `?${query}` : ''}`;

  // draft (preview) → sempre fresco (no-store, forza dinamico).
  // altrimenti → cache con revalidate: baked a build-time in static,
  // rigenerato ogni 60s in ISR.
  const cacheOpts = opts.draft
    ? { cache: 'no-store' as const }
    : { next: { revalidate: 60 } };

  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    ...cacheOpts,
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Strapi ${res.status} su ${url}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.data as T;
}

// status: 'published' (default) | 'draft' (preview)
type Status = 'published' | 'draft';

// URL assoluto per un media (Strapi torna path relativo su disco locale)
export function mediaUrl(media?: StrapiMedia | null): string | null {
  if (!media?.url) return null;
  return media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`;
}

// --- Pagine ---

export async function getPage(
  slug: string,
  locale: Locale,
  status: Status = 'published',
): Promise<Page | null> {
  const data = await fetchAPI<Page[]>('pages', {
    filters: { slug: { $eq: slug } },
    locale,
    status,
    populate: {
      seo: { populate: '*' },
      blocks: BLOCKS_POPULATE,
    },
    pagination: { limit: 1 },
  }, { draft: status === 'draft' });
  return data && data.length ? data[0] : null;
}

export async function getAllSlugs(locale: Locale): Promise<string[]> {
  const data = await fetchAPI<Page[]>('pages', {
    fields: ['slug'],
    locale,
    pagination: { limit: 1000 },
  });
  return (data || []).map((p) => p.slug);
}

// --- Globali (single types) ---
// Theme NON è localizzato (colori/font) → nessun locale.

export async function getTheme(): Promise<Theme | null> {
  return fetchAPI<Theme>('theme', { populate: '*' });
}

export async function getNavigation(locale: Locale): Promise<Navigation | null> {
  return fetchAPI<Navigation>('navigation', { locale, populate: '*' });
}

export async function getHeader(locale: Locale): Promise<Header | null> {
  return fetchAPI<Header>('header', { locale, populate: '*' });
}

export async function getFooter(locale: Locale): Promise<Footer | null> {
  return fetchAPI<Footer>('footer', {
    locale,
    populate: { links: { populate: '*' } },
  });
}
