# newsite — JAMstack (Strapi CMS + Next.js)

Monorepo di test per approccio JAMstack WordPress-style: contenuti/tema/menu/pagine
definiti dinamicamente in Strapi, frontend Next.js che li renderizza.

```
newsite/
├─ cms/        # Strapi 5 — CMS (Page dynamic-zone, Theme, Navigation, Header, Footer)
└─ frontend/   # Next.js 15 — motore di rendering (catch-all + block renderer)
```

## Avvio rapido

### 1. CMS (Strapi)
```bash
cd cms
cp .env.example .env        # genera/riempi i secret (vedi sotto)
npm install
npm run develop             # http://localhost:1337/admin
```
Primo avvio: crea l'utente admin.

**Genera i secret** (metti i valori in `.env`):
```bash
# 4 chiavi per APP_KEYS (separate da virgola) + gli altri secret
node -e "for(let i=0;i<7;i++)console.log(require('crypto').randomBytes(16).toString('base64'))"
```

**Lettura pubblica**: in `development` è concessa **in automatico** al boot
(`src/index.js` bootstrap → find/findOne su Page, Theme, Navigation, Header, Footer).
In `production` NON è auto-concessa: usa un API token read-only
(Settings → API Tokens, poi in `frontend/.env.local`) o abilita i permessi a mano.

### 2. Frontend (Next.js)
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000  (SSR/dev)
```

Build per modalità:
```bash
npm run build:static        # BUILD_MODE=static  → output export (out/)
npm run build:isr           # BUILD_MODE=isr     → server/ISR
```

**Home page**: lo UID di Strapi non accetta `/`. Crea la Page della home con
slug `home` — il frontend lo mappa alla root `/` (vedi `HOME_SLUG` in
`src/lib/strapi.ts`). Le altre pagine usano il loro slug normale (`chi-siamo`, ecc.).

## Come funziona (mentale)
- **Strapi** = struttura + contenuti + tema (i dati).
- **Next** = motore che interpreta blocchi e applica il tema (la logica).
- Il frontend non conosce le pagine: la route catch-all `[locale]/[[...slug]]` chiede a
  Strapi la pagina per slug+lingua, e `BlockRenderer` mappa `__component` → componente React.

## i18n (multilingua)
Prefisso sempre presente: `/it/...`, `/en/...` (zero middleware, ok static + ISR).
- Lingue in `frontend/src/lib/i18n.ts` (`locales`, `defaultLocale`). Sito solo-IT?
  lascia `locales = ['it']`: routing identico, nessun `/en`.
- Locale seedati in Strapi al boot (`cms/src/index.js`): `it` (default) + `en`.
- Localizzati nel CMS: Page, Navigation, Header, Footer (Theme no, sono colori).
- Root `/` → redirect a `/<defaultLocale>`. `<html lang>` per lingua. Switcher in Header.
- Fetch per lingua: `?locale=xx`. Pagina assente in una lingua → 404.

## Preview (bozza prima della pubblicazione)
Richiede runtime → funziona su **dev/ISR**, NON nel static puro (che serve solo published).
- Strapi: bottone preview nell'editor (`config/admin.js` → `preview.handler`) apre
  `/<CLIENT_URL>/api/preview?secret=...&locale=..&slug=..`.
- Frontend: `/api/preview` valida il secret, attiva `draftMode` (cookie) e reindirizza.
  La pagina, in draft, fetcha `?status=draft` e mostra un banner (esci: `/api/exit-preview`).
- `PREVIEW_SECRET` deve combaciare tra `cms/.env` e `frontend/.env.local`.
- Le route preview sono file `*.preview.ts`: incluse solo fuori dal build static
  (vedi `pageExtensions` in `next.config.mjs`), così `build:static` non si rompe.

## Webhook rebuild (publish → aggiorna il sito)
Trigger **solo su publish/unpublish** (non sui save di bozza), con **debounce** per
coalescare i burst. Logica in `cms/src/rebuild.js` (middleware `strapi.documents.use`).

Due target, guidati da env (`cms/.env`):
- **ISR**: `REVALIDATE_URL` + `REVALIDATE_SECRET` → POST `/api/revalidate` `{all:true}`
  → `revalidatePath('/', 'layout')`. Nessun rebuild, nessun downtime.
- **Static**: `DEPLOY_HOOK_URL` → POST al deploy hook di Coolify/CF Pages (rebuild completo).
  Vuoto in locale (solo ISR).
- `REBUILD_DEBOUNCE_MS` (5000 in test; in prod ~300000): N publish ravvicinati → 1 dispatch.

`REVALIDATE_SECRET` deve combaciare tra `cms/.env` e `frontend/.env.local`.
La route `/api/revalidate` è `*.runtime.ts` → esclusa dal build static (come la preview).

## Aggiungere un blocco nuovo
1. `cms/src/components/blocks/<nome>.json` — schema campi.
2. Aggiungilo alla dynamic zone in `cms/src/api/page/content-types/page/schema.json`.
3. `frontend/src/blocks/<Nome>.tsx` — componente React.
4. Registralo in `frontend/src/blocks/index.tsx` (BLOCK MAP).

## Note prod (fuori scope test)
- Rebuild via webhook: Strapi publish → deploy hook. Debounce lato ricevente.
- Media: R2 / MinIO (provider upload S3). In test = disco locale Strapi.
- Static su CF Pages, ISR su Coolify (Node). CMS+DB on-prem.