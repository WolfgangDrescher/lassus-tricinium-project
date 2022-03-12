import tricinia from 'lassus-geistliche-psalmen';
import { useTricinium } from '../../composables/useTricinium';

export async function onBeforeRender(pageContext) {
    const { name } = pageContext.routeParams;
    const tricinium = tricinia.find((t) => t.id === name);
    if (!tricinium) throw new Error(`Tricinium "${name}" not found`);
    const pageProps = { tricinium: useTricinium(tricinium) };

    return {
        pageContext: {
            pageProps,
        },
    };
}

export function prerender() {
    const names = ['01-beatus-vir', '02-quare-fremuerunt-gentes'];
    const urls = names.map((name) => `/tricinium/${name}`);
    return urls;
}
