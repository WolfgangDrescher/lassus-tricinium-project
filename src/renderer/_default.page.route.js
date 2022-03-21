const locales = ['de', 'en'];
const localeDefault = 'de';

function extractLocale(url) {
    const urlPaths = url.split('/');

    let locale;
    let urlWithoutLocale;
    // We remove the URL locale, for example `/de-DE/about` => `/about`
    const firstPath = urlPaths[1];
    console.log(firstPath);
    if (locales.filter((locale) => locale !== localeDefault).includes(firstPath)) {
        locale = firstPath;
        urlWithoutLocale = '/' + urlPaths.slice(2).join('/');
    } else {
        locale = localeDefault;
        urlWithoutLocale = url;
    }

    return { locale, urlWithoutLocale };
}

export function onBeforeRoute(pageContext) {
    let { url } = pageContext;

    const { urlWithoutLocale, locale } = extractLocale(url);

    url = urlWithoutLocale;

    return {
        pageContext: {
            // We make `locale` available as `pageContext.locale`.
            // We then use https://vite-plugin-ssr.com/pageContext-anywhere
            // to access `pageContext.locale` in any React/Vue component.
            locale,
            // We overwrite the original URL
            url,
        },
    };
}
