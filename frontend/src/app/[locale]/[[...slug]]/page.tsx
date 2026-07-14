import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import type { Metadata } from 'next';
import { getPage, getAllSlugs, mediaUrl, HOME_SLUG } from '@/lib/strapi';
import { isLocale, type Locale } from '@/lib/i18n';
import { BlockRenderer } from '@/blocks';

// ISR: rigenera al massimo ogni 60s (ignorato in BUILD_MODE=static).
export const revalidate = 60;

// In BUILD_MODE=static draftMode non è disponibile (niente runtime): lo saltiamo.
const isStaticBuild = process.env.BUILD_MODE === 'static';

// Riceve ogni locale dal segmento genitore; restituisce gli slug di quella lingua.
export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) return [];
  const slugs = await getAllSlugs(locale);
  return slugs.map((slug) => ({
    slug:
      slug === HOME_SLUG || slug === '/' || slug === ''
        ? []
        : slug.split('/').filter(Boolean),
  }));
}

function slugFromParams(slug?: string[]): string {
  // URL root della lingua → pagina con slug "home"
  if (!slug || slug.length === 0) return HOME_SLUG;
  return slug.join('/');
}

async function resolveStatus(): Promise<'published' | 'draft'> {
  if (isStaticBuild) return 'published';
  const dm = await draftMode();
  return dm.isEnabled ? 'draft' : 'published';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const status = await resolveStatus();
  const page = await getPage(slugFromParams(slug), locale as Locale, status);
  if (!page) return {};
  const og = mediaUrl(page.seo?.ogImage);
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    openGraph: og ? { images: [og] } : undefined,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const status = await resolveStatus();
  const page = await getPage(slugFromParams(slug), locale as Locale, status);
  if (!page) notFound();

  return (
    <>
      {status === 'draft' && (
        <div
          style={{
            background: '#b45309',
            color: '#fff',
            textAlign: 'center',
            padding: '0.5rem',
            fontSize: '0.9rem',
          }}
        >
          Anteprima bozza — <a href="/api/exit-preview" style={{ color: '#fff', textDecoration: 'underline' }}>esci</a>
        </div>
      )}
      <BlockRenderer blocks={page.blocks} locale={locale as Locale} />
    </>
  );
}
