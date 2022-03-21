import { getPage } from 'vite-plugin-ssr/client';
import { createApp } from '../app';
import { createI18n } from 'vue-i18n';
import '../assets/base.css';

hydrate();

async function hydrate() {
    // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
    // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
    const pageContext = await getPage();
    const app = createApp(pageContext);
    const i18n = createI18n({
        // something vue-i18n options here ...
    });
    app.use(i18n);
    app.mount('#app');
}
