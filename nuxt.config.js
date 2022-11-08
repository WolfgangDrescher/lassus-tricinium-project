// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    // target: 'static',
    ssr: true,
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxtjs/google-fonts',
        'nuxt-icon',
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
});
