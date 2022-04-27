import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    srcDir: 'src/',
    // target: 'static',
    ssr: false,
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
    modules: ['@nuxtjs/tailwindcss'],
    buildModules: [
        ['@pinia/nuxt', { disableVuex: true }],
    ],
});
