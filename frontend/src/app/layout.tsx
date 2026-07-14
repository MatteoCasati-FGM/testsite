import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'newsite',
  description: 'JAMstack test — Strapi + Next.js',
};

// Root layout passthrough: <html>/<body> sono resi dai layout per-locale
// (pattern i18n con App Router). Le route non-localizzate (/, 404) rendono
// il proprio documento completo.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
