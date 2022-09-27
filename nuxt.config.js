import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    srcDir: 'src/',
    // target: 'static',
    ssr: true,
    // routes: {
    //     '/': {
    //         prerender: true
    //     },
    //     '*': {
    //         static: true,
    //         prerender: true,
    //     },
    // },
    generate: {
        routes: [
            '/about'
        ],
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
    ],
});
