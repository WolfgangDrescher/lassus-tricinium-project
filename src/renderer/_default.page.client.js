import { createApp } from '../app';
import { createPinia } from 'pinia';
import '../assets/base.css';

// import { getPageTitle } from './getPageTitle';
import { useClientRouter } from 'vite-plugin-ssr/client/router';

let app;

const { hydrationPromise } = useClientRouter({
    async render(pageContext) {
        if (!app) {
            console.log('no app');
            app = createApp(pageContext);
            app.use(createPinia());
            app.mount('#app');
        } else if (app.changePage) {
            console.log('app');
            console.log({ app });
            app.changePage(pageContext);
        }
        // document.title = getPageTitle(pageContext);
    },
    ensureHydration: true,
    prefetchLinks: true,
});
