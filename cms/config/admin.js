module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },

  // Preview: bottone "Open preview" nell'editor → apre il frontend in draft mode.
  // Richiede runtime lato frontend, quindi punta al deploy ISR/dev (non static puro).
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL', 'http://localhost:3000')],
      async handler(uid, { documentId, locale, status }) {
        // Preview solo per le Page (le altre entità non hanno una URL propria)
        if (uid !== 'api::page.page') return null;

        const doc = await strapi.documents(uid).findOne({
          documentId,
          locale,
          status: 'draft',
        });
        if (!doc) return null;

        const clientUrl = env('CLIENT_URL', 'http://localhost:3000');
        const secret = env('PREVIEW_SECRET', '');
        const params = new URLSearchParams({
          secret,
          locale: locale || 'it',
          slug: doc.slug || 'home',
          status: status || 'draft',
        });
        return `${clientUrl}/api/preview?${params.toString()}`;
      },
    },
  },
});
