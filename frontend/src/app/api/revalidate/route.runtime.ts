import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

// Chiamata da Strapi al publish/unpublish (target ISR).
//   POST /api/revalidate?secret=...
//   body: { all: true }  oppure  { paths: ["/it", "/en/about"] }
// Rigenera on-demand senza rebuild completo.
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (
    !process.env.REVALIDATE_SECRET ||
    secret !== process.env.REVALIDATE_SECRET
  ) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  // all → purga l'intero albero (layout root): semplice e robusto per siti piccoli.
  if (body.all) {
    revalidatePath('/', 'layout');
    return Response.json({ revalidated: true, scope: 'all' });
  }

  const paths: string[] = Array.isArray(body.paths) ? body.paths : [];
  paths.forEach((p) => revalidatePath(p));
  return Response.json({ revalidated: true, paths });
}
