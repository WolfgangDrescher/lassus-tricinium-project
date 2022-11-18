// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    // target: 'static',
    ssr: true,
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxtjs/google-fonts',
        'nuxt-icon',
        '@nuxtjs/i18n-edge',
    ],
    vite: {
        optimizeDeps: {
            include: [
                'verovio/wasm',
                'verovio/wasm-hum',
            ],
        },
    },
    googleFonts: {
        stylePath: 'css/fonts.css',
        download: true,
        preload: true,
        prefetch: true,
        preconnect: true,
        display: 'swap',
        families: {
            Alegreya: {
                wght: [400, 700],
                ital: [400],
            },
            'Alegreya Sans': {
                wght: [400, 700, 800],
            },
        },
    },
    i18n: {
        strategy: 'prefix_except_default',
        locales: [
            { code: 'de', iso: 'de-DE', file: 'de.yaml', dir: 'ltr' },
        ],
        defaultLocale: 'de',
        langDir: 'locales/',
        vueI18n: {
            fallbackLocale: 'de',
            legacy: false,
            locale: 'de',
        },

    },
});
