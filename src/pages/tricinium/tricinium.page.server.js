import tricinia from 'lassus-geistliche-psalmen';

export async function onBeforeRender(pageContext) {
    const { name } = pageContext.routeParams;
    const tricinium = tricinia.find(t => t.id === name);
    if (!tricinium) throw new Error(`Tricinium "${name}" not found`);
    const pageProps = { tricinium };

    return {
        pageContext: {
            pageProps,
        },
    };
}

export function prerender() {
    const names = tricinia.map(t => t.id);
    const urls = names.map(name => `/tricinium/${name}`);
    return urls;
}
