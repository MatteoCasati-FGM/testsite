import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { HOME_SLUG } from '@/lib/strapi';

// Chiamata dal bottone Preview di Strapi:
//   /api/preview?secret=...&locale=it&slug=home&status=draft
// Valida il secret, attiva draftMode (cookie) e reindirizza alla pagina.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const locale = searchParams.get('locale') || 'it';
  const slug = searchParams.get('slug') || HOME_SLUG;

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview token', { status: 401 });
  }

  const dm = await draftMode();
  dm.enable();

  const path = slug === HOME_SLUG ? `/${locale}` : `/${locale}/${slug}`;
  redirect(path);
}
