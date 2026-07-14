import AuthLogo from './extensions/logo.svg';
import MenuLogo from './extensions/logo.svg';
import Favicon from './extensions/logo.svg';

export default {
  config: {
    // Logo pagina di login
    auth: {
      logo: AuthLogo,
    },
    // Logo menu laterale (in alto a sinistra)
    menu: {
      logo: MenuLogo,
    },
    // Favicon della scheda browser
    head: {
      favicon: Favicon,
    },
    // Nasconde watermark/link "Strapi" dove possibile
    tutorials: false,
    notifications: { releases: false },

    // Lingua di default del pannello
    locales: ['it'],

    // Override testi (white labeling)
    translations: {
      it: {
        'Auth.form.welcome.title': 'Benvenuto in Planetel CMS',
        'Auth.form.welcome.subtitle': 'Accedi al pannello di amministrazione',
        'Auth.form.email.label': 'Email',
        'Auth.form.password.label': 'Password',
        'Auth.form.button.login.strapi': 'Accedi',
        'app.components.LeftMenu.navbrand.title': 'Planetel CMS',
        'app.components.LeftMenu.navbrand.workplace': 'Area amministrazione',
        'HomePage.header.title': 'Benvenuto 👋',
        'Settings.application.strapiVersion': 'Versione',
      },
      en: {
        'Auth.form.welcome.title': 'Welcome to Planetel CMS',
        'Auth.form.welcome.subtitle': 'Log in to the admin panel',
        'app.components.LeftMenu.navbrand.title': 'Planetel CMS',
        'app.components.LeftMenu.navbrand.workplace': 'Admin area',
      },
    },

    // Tema colori opzionale
    theme: {
      light: {},
      dark: {},
    },
  },

  bootstrap(app) {
    // hook opzionale
  },
};
