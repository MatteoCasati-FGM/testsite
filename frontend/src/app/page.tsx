import { defaultLocale } from '@/lib/i18n';

// Root "/" → reindirizza alla lingua di default.
// meta-refresh invece di redirect() così funziona anche in export statico.
export default function RootRedirect() {
  const url = `/${defaultLocale}`;
  return (
    <html lang={defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${url}`} />
      </head>
      <body>
        <p>
          Redirect verso <a href={url}>{url}</a>…
        </p>
      </body>
    </html>
  );
}
