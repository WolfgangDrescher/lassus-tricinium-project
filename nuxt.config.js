// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    srcDir: 'src/',
    // target: 'static',
    ssr: true,
    generate: {
        routes: [
            '/about'
        ],
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
    ],
    css: [
        '@/assets/base.css',
    ],
    vite: {
        optimizeDeps: {
            include: [
                'verovio/wasm',
                'verovio/wasm-hum',
            ],
        },
    },
});
