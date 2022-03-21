import { createSSRApp, defineComponent, h, reactive, markRaw } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { setPageContext } from './composables/usePageContext';

export { createApp };

function createApp(pageContext) {
    const { Page } = pageContext;

    let rootComponent;
    const PageWithLayout = defineComponent({
        data: () => ({
            Page: markRaw(Page),
            pageProps: markRaw(pageContext.pageProps || {}),
        }),
        created() {
            rootComponent = this
        },
        render() {
            return h(
                DefaultLayout,
                {},
                {
                    default: () => {
                        return h(this.Page, this.pageProps || {});
                    },
                },
            );
        },
    });

    const app = createSSRApp(PageWithLayout);

    const pageContextReactive = reactive(pageContext);

    Object.assign(app, {
        changePage: (pageContext) => {
            console.log('changePage');
            Object.assign(pageContextReactive, pageContext);
            console.log(pageContextReactive);
            rootComponent.Page = markRaw(pageContext.Page)
            rootComponent.pageProps = markRaw(pageContext.pageProps || {})
        },
    });

    setPageContext(app, pageContext);

    return app;
}
