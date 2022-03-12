import tricinia from 'lassus-geistliche-psalmen';

export async function onBeforeRender(pageContext) {
    const pageProps = { tricinia };
    return {
        pageContext: {
            pageProps,
        },
    };
}
