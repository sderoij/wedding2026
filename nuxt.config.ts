// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  i18n: {
    locales: [
      { code: 'nl', iso: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'nl',
    strategy: 'prefix',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  app: {
    baseURL: '/',
    head: {
      title: 'W 💍 S - 10 juli 2026',
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'googlebot', content: 'noindex, nofollow' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      appsScriptUrl: process.env.NUXT_PUBLIC_APPS_SCRIPT_URL || ''
    }
  }
})
