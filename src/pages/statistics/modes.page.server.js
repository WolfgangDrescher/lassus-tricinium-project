import tricinia from 'lassus-geistliche-psalmen';

export async function onBeforeRender(pageContext) {
    return {
        pageContext: {
            pageProps: {
                tricinia,
            },
        },
    };
}
