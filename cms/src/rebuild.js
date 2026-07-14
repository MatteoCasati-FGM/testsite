'use strict';

// Trigger di rebuild/revalidate del frontend, SOLO su publish/unpublish
// dei content type che compongono il sito. Con debounce per coalescare i burst
// (es. editor che pubblica più entità di fila → un solo dispatch).

const WATCHED = new Set([
  'api::page.page',
  'api::navigation.navigation',
  'api::header.header',
  'api::footer.footer',
  'api::theme.theme',
]);

const TRIGGER_ACTIONS = new Set(['publish', 'unpublish']);

let timer = null;

function scheduleDispatch(strapi) {
  const debounceMs = parseInt(process.env.REBUILD_DEBOUNCE_MS || '5000', 10);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    dispatch(strapi).catch((e) =>
      strapi.log.error(`[rebuild] dispatch fallito: ${e.message}`),
    );
  }, debounceMs);
  strapi.log.info(`[rebuild] dispatch programmato tra ${debounceMs}ms`);
}

async function dispatch(strapi) {
  const tasks = [];

  // ISR: revalidate on-demand
  const revalidateUrl = process.env.REVALIDATE_URL;
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (revalidateUrl && revalidateSecret) {
    const url = `${revalidateUrl}?secret=${encodeURIComponent(revalidateSecret)}`;
    tasks.push(
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      }).then((r) =>
        strapi.log.info(`[rebuild] revalidate → ${r.status}`),
      ),
    );
  }

  // Static: deploy hook (Coolify / CF Pages) → rebuild completo
  const deployHook = process.env.DEPLOY_HOOK_URL;
  if (deployHook) {
    tasks.push(
      fetch(deployHook, { method: 'POST' }).then((r) =>
        strapi.log.info(`[rebuild] deploy hook → ${r.status}`),
      ),
    );
  }

  if (!tasks.length) {
    strapi.log.warn(
      '[rebuild] nessun target configurato (REVALIDATE_URL o DEPLOY_HOOK_URL)',
    );
    return;
  }
  await Promise.allSettled(tasks);
}

function registerRebuildTrigger(strapi) {
  strapi.documents.use(async (context, next) => {
    const result = await next();
    const { uid, action } = context;
    if (TRIGGER_ACTIONS.has(action) && WATCHED.has(uid)) {
      strapi.log.info(`[rebuild] ${action} su ${uid} → trigger`);
      scheduleDispatch(strapi);
    }
    return result;
  });
}

module.exports = { registerRebuildTrigger };
