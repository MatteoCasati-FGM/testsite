/** @type {import('next').NextConfig} */

// BUILD_MODE=static → export puro (cartella out/), niente runtime.
// BUILD_MODE=isr (o non impostato) → build server con ISR/SSR.
const isStatic = process.env.BUILD_MODE === 'static';

// host di Strapi per next/image (in prod: dominio CDN/R2)
const strapiUrl = new URL(process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337');

const baseExtensions = ['tsx', 'ts', 'jsx', 'js'];

const nextConfig = {
  output: isStatic ? 'export' : undefined,

  // File *.runtime.ts(x) sono route che richiedono runtime (draftMode, revalidate).
  // Vengono inclusi SOLO fuori dal build static, così `build:static` non si rompe.
  pageExtensions: isStatic
    ? baseExtensions
    : ['runtime.tsx', 'runtime.ts', ...baseExtensions],

  images: {
    // export puro non ha optimizer runtime → serve immagini così come sono
    unoptimized: isStatic,
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(':', ''),
        hostname: strapiUrl.hostname,
        port: strapiUrl.port || '',
      },
    ],
  },
};

export default nextConfig;
