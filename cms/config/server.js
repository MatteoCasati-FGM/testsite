module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // URL pubblico dietro reverse-proxy (Coolify/Traefik). Vuoto in locale.
  url: env('PUBLIC_URL', ''),
  // Fidati degli header X-Forwarded-* del proxy (protocollo/host corretti
  // per cookie, preview, redirect). true solo in prod dietro proxy.
  proxy: env.bool('IS_PROXIED', false),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
