import { fileURLToPath } from 'node:url';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://lassus.mh-freiburg.de',
        },
    },
    app: {
        buildAssetsDir: '/build/',
        head: {
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: 'robots', name: 'robots', content: process.env.DEPLOY_ENV === 'prod' ? 'all' : 'noindex' },
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: 'any' },
            ],
        },
    },
    ssr: true,
    srcDir: 'src/',
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxtjs/google-fonts',
        'nuxt-icon',
        '@nuxtjs/i18n-edge',
        '@nuxt/content',
        '@nuxtjs/plausible',
    ],
    vite: {
        worker: {
            format: 'es',
        },
    },
    nitro: {
        publicAssets: [
            {
                baseURL: 'lassus-geistliche-psalmen',
                dir: fileURLToPath(new URL('./lassus-geistliche-psalmen/kern', import.meta.url)),
                maxAge: 3600,
            },
            {
                baseURL: 'ulenberg-psalmen-davids',
                dir: fileURLToPath(new URL('./ulenberg-psalmen-davids/kern', import.meta.url)),
                maxAge: 3600,
            },
            {
                baseURL: 'kern',
                dir: fileURLToPath(new URL('./kern', import.meta.url)),
            },
        ],
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
        config: {
            fallbackLocale: 'de',
            legacy: false,
            locale: 'de',
        },
    },
    content: {
        // defaultLocale: 'de',
        sources: {
            root: {
                driver: 'fs',
                // prefix: '/root',
                base: fileURLToPath(new URL('./content', import.meta.url)),
            },
            lgp: {
                driver: 'fs',
                prefix: '/lgp',
                base: fileURLToPath(new URL('./lassus-geistliche-psalmen/meta', import.meta.url)),
            },
        },
    },
    plausible: {
        apiHost: 'https://plausible.mh-freiburg.de',
    },
});
