import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

// Disattiva la preview (cancella il cookie draftMode) e torna alla home.
export async function GET() {
  const dm = await draftMode();
  dm.disable();
  redirect('/');
}
