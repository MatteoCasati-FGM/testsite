'use strict';

const { registerRebuildTrigger } = require('./rebuild');

// Content type → azioni da concedere al ruolo Public.
// Collection: find + findOne. Single type: find.
const PUBLIC_READ = {
  'api::page.page': ['find', 'findOne'],
  'api::theme.theme': ['find'],
  'api::navigation.navigation': ['find'],
  'api::header.header': ['find'],
  'api::footer.footer': ['find'],
};

// Locale da garantire. Il primo con default:true diventa la lingua di default.
const LOCALES = [
  { code: 'it', name: 'Italian (it)', isDefault: true },
  { code: 'en', name: 'English (en)', isDefault: false },
];

async function ensureLocales(strapi) {
  const svc = strapi.plugin('i18n').service('locales');
  for (const { code, name, isDefault } of LOCALES) {
    let loc = await svc.findByCode(code);
    if (!loc) {
      loc = await svc.create({ code, name, isDefault });
      strapi.log.info(`[bootstrap] i18n: creato locale ${code}`);
    }
    if (isDefault) {
      await svc.setDefaultLocale({ code });
    }
  }
}

async function grantPublicRead(strapi) {
  if (process.env.NODE_ENV === 'production') return;
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  for (const [uid, actions] of Object.entries(PUBLIC_READ)) {
    for (const action of actions) {
      const actionId = `${uid}.${action}`;
      const exists = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: actionId, role: publicRole.id } });
      if (!exists) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({ data: { action: actionId, role: publicRole.id } });
        strapi.log.info(`[bootstrap] Public: abilitato ${actionId}`);
      }
    }
  }
}

module.exports = {
  register(/* { strapi } */) {},

  /**
   * bootstrap: seed locale i18n + (in dev) lettura pubblica.
   */
  async bootstrap({ strapi }) {
    await ensureLocales(strapi);
    await grantPublicRead(strapi);
    registerRebuildTrigger(strapi);
  },
};
