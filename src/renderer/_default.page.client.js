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

    // If `ensureHydration: true` then `vite-plugin-ssr` ensures that the first render is always
    // a hydration. (In other words, the hydration process is never interrupted — even if the
    // user clicks on a link before the hydration started. Default value: `false`.)
    // If we use Vue, we need `ensureHydration: true` to avoid "Hydration Mismatch" errors.
    // If we use React, we can leave `ensureHydration: false` for a slight performance improvement.
    ensureHydration: true,
    prefetchLinks: true,
});
