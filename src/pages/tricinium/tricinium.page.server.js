export { onBeforeRender };
export { prerender };

async function onBeforeRender(pageContext) {
    const { name } = pageContext.routeParams;
    const pageProps = { name };
    return {
        pageContext: {
            pageProps,
        },
    };
}

function prerender() {
    const names = ['01-beatus-vir', '02-quare-fremuerunt-gentes'];
    const urls = names.map((name) => `/tricinium/${name}`);
    return urls;
}
