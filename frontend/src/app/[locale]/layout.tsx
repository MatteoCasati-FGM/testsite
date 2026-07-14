import { notFound } from 'next/navigation';
import { getTheme, getNavigation, getHeader, getFooter } from '@/lib/strapi';
import { themeToCssVars } from '@/lib/theme';
import { locales, isLocale } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Genera un ramo per ogni lingua (necessario per l'export statico).
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Theme è globale (non localizzato); nav/header/footer per lingua.
  const [theme, nav, header, footer] = await Promise.all([
    getTheme(),
    getNavigation(locale),
    getHeader(locale),
    getFooter(locale),
  ]);

  return (
    <html lang={locale} style={themeToCssVars(theme)}>
      <body>
        <Header data={header} theme={theme} nav={nav} locale={locale} />
        <main>{children}</main>
        <Footer data={footer} locale={locale} />
      </body>
    </html>
  );
}
