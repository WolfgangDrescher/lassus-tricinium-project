import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ssr from 'vite-plugin-ssr/plugin';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ssr(),
        // vueI18n({
        //     include: fileURLToPath(new URL('./src/locales/**', import.meta.url)),
        // }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        dedupe: ['vue'],
    },
    clearScreen: false,
});
