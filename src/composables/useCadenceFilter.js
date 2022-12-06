const filterByComposer = (composer, element) => {
    if (!composer) return true;
    return composer.toLowerCase() === element.tricinium.composer?.toLowerCase();
};

const filterByTitle = (title, element) => {
    if (!title) return true;
    return element.tricinium.title?.toLowerCase().includes(title?.toLowerCase());
};

const filterByLyrics = (lyrics, element) => {
    if (!lyrics) return true;
    return element.tricinium.lyricsAsString()?.toLowerCase().includes(lyrics?.toLowerCase());
};

const filterByNr = (nr, element) => {
    if (!nr) return true;
    return parseInt(element.tricinium.nr, 10) === parseInt(nr, 10);
};

const filterByFinalis = (finalis, element) => {
    if (!finalis.length) return true;
    return finalis.map(f => f?.toLowerCase()).includes(element.tricinium.finalis?.toLowerCase());
};

const filterBySearchText = (searchText, element) => {
    if (!searchText) return true;
    return filterByTitle(searchText, element) || filterByNr(searchText, element) || filterByLyrics(searchText, element);
};

const filterByDegree = (degrees, element) => {
    if (!degrees.length) return true;
    return degrees.map(d => parseInt(d, 10)).includes(parseInt(element.degree, 10));
};

const filterByUltima = (ultimas, element) => {
    if (!ultimas.length) return true;
    return ultimas.map(u => u?.toLowerCase()).includes(element.ultima.toLowerCase());
};


export function useCadenceFilter(elements) {

    const filter = useCadenceFilterStore();
    console.log(filter);

    const filteredElements = computed(() => {
        const filteredElements = elements.filter(element => {
            const composerMatches = filterByComposer(filter.composer, element);
            const titleMatches = filterByTitle(filter.title, element);
            const lyricsMatches = filterByLyrics(filter.lyrics, element);
            const nrMatches = filterByNr(filter.nr, element);
            const finalisMatched = filterByFinalis(filter.finalis, element);
            const searchTextMatched = filterBySearchText(filter.searchText, element);
            const degreesMatched = filterByDegree(filter.degrees, element);
            const ultimasMatched = filterByUltima(filter.ultimas, element);

            return (
                composerMatches &&
                titleMatches &&
                lyricsMatches &&
                nrMatches &&
                finalisMatched &&
                searchTextMatched &&
                degreesMatched &&
                ultimasMatched
            );
        });

        filteredElements.sort((a, b) => {
            if (filteredElements.orderBy === 'id') {
                return a.id > b.id ? 1 : -1;
            }
            return 0;
        });

        return filteredElements;
    });

    return {
        filteredElements,
    };
}
