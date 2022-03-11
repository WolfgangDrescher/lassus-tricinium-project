import { createSSRApp, h } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { setPageContext } from './composables/usePageContext';

export { createApp };

function createApp(pageContext) {
    const { Page, pageProps } = pageContext;
    const PageWithLayout = {
        render() {
            return h(
                DefaultLayout,
                {},
                {
                    default() {
                        return h(Page, pageProps || {});
                    },
                }
            );
        },
    };

    const app = createSSRApp(PageWithLayout);

    // We make `pageContext` available from any Vue component
    setPageContext(app, pageContext);

    return app;
}
