// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss'],

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
    head: {
      title: 'Wedding - July 10, 2026',
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      appsScriptUrl: process.env.NUXT_PUBLIC_APPS_SCRIPT_URL || ''
    }
  }
})
