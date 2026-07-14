# Deploy — Coolify (monorepo)

Un solo repo Git, 3 Application su Coolify, ciascuna con **Base Directory** diversa.
Build via Nixpacks (auto-detect Node, nessun Dockerfile).

```
newsite/  (repo GitHub)
├─ cms/        → Application "cms"            (Base dir /cms)
└─ frontend/   → Application "frontend-isr"   (Base dir /frontend, BUILD_MODE=isr)
               → Application "frontend-static"(Base dir /frontend, BUILD_MODE=static)
```

Domini d'esempio (sostituisci col tuo):
- `cms.tuodominio.it`      → Strapi admin + API
- `preview.tuodominio.it`  → Next ISR (preview bozze)
- `www.tuodominio.it`      → Next static (sito pubblico)

---

## Ordine di deploy
1. **cms** per primo — gli altri due lo interrogano al build time.
2. In Strapi prod: crea admin, poi API token **read-only** (Settings → API Tokens).
3. **frontend-isr**, poi **frontend-static** (incolla il token read-only in entrambi).

⚠️ Al build time i frontend devono raggiungere `cms.tuodominio.it` (o URL interno Coolify).

---

## Application 1 — cms (Strapi)

- Base Directory: `/cms`
- Build: `npm ci && npm run build`
- Start: `npm run start`
- Volume persistente: mount su `/cms/public/uploads` (o provider S3/R2)
- Dominio: `cms.tuodominio.it`

Env (Coolify UI — NON in git):
```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=https://cms.tuodominio.it
IS_PROXIED=true

# Secret STABILI — non rigenerarli dopo il primo deploy
APP_KEYS=<4 chiavi,separate,da,virgola>
API_TOKEN_SALT=<random>
ADMIN_JWT_SECRET=<random>
TRANSFER_TOKEN_SALT=<random>
JWT_SECRET=<random>
ENCRYPTION_KEY=<random>

# Postgres esterno
DATABASE_CLIENT=postgres
DATABASE_HOST=<host>
DATABASE_PORT=5432
DATABASE_NAME=<nome>
DATABASE_USERNAME=<user>
DATABASE_PASSWORD=<pass>
DATABASE_SSL=true
DATABASE_SCHEMA=public

# Preview + rebuild
CLIENT_URL=https://preview.tuodominio.it
PREVIEW_SECRET=<uguale ai frontend>
REVALIDATE_URL=https://preview.tuodominio.it/api/revalidate
REVALIDATE_SECRET=<uguale a frontend-isr>
DEPLOY_HOOK_URL=<deploy hook di frontend-static>
REBUILD_DEBOUNCE_MS=300000
```

Genera i secret:
```bash
node -e "for(let i=0;i<7;i++)console.log(require('crypto').randomBytes(16).toString('base64'))"
```

---

## Application 2 — frontend-isr (Next ISR, preview)

- Base Directory: `/frontend`
- Build: `npm ci && npm run build`   (con `BUILD_MODE=isr` in env)
- Start: `npm run start`
- Dominio: `preview.tuodominio.it`
- È il target di `REVALIDATE_URL` del cms.

Env:
```
NODE_ENV=production
BUILD_MODE=isr
NEXT_PUBLIC_STRAPI_URL=https://cms.tuodominio.it
STRAPI_API_TOKEN=<read-only token di prod>
PREVIEW_SECRET=<uguale al cms>
REVALIDATE_SECRET=<uguale al cms>
```

---

## Application 3 — frontend-static (Next static, sito pubblico)

- Base Directory: `/frontend`
- Tipo: **Static Site** (serve la cartella `out/`)
- Build: `npm ci && npm run build`   (con `BUILD_MODE=static` in env) → output `out/`
- Nessun runtime.
- Dominio: `www.tuodominio.it`
- Rebuild: triggerato dal **Deploy Hook** Coolify di questa app → messo in `DEPLOY_HOOK_URL` del cms.

Env (usate solo al build):
```
BUILD_MODE=static
NEXT_PUBLIC_STRAPI_URL=https://cms.tuodominio.it
STRAPI_API_TOKEN=<read-only token di prod>
```

---

## Flusso publish → aggiornamento sito
Editor pubblica in Strapi → `cms/src/rebuild.js` (debounce `REBUILD_DEBOUNCE_MS`):
- POST `REVALIDATE_URL` → frontend-isr rivalida (no rebuild, preview aggiornata)
- POST `DEPLOY_HOOK_URL` → Coolify ribuilda frontend-static (sito pubblico)

## Note
- Produzione NON auto-concede lettura pubblica: serve l'API token read-only nei frontend.
- `PREVIEW_SECRET` e `REVALIDATE_SECRET` devono combaciare tra cms e frontend-isr.
- Dev locale resta su sqlite (`cms/.env` con `DATABASE_CLIENT=sqlite`); il Postgres di prod
  ha un solo scrittore (Strapi su Coolify).
