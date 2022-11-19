const filterByComposers = (composers, element) => {
    if (!composers.length) return true;
    return composers.map(c => c?.toLowerCase()).includes(element.composer?.toLowerCase());
};

const filterByTitle = (title, element) => {
    if (!title) return true;
    return element.title?.toLowerCase().includes(title?.toLowerCase());
};

const filterByLyrics = (lyrics, element) => {
    if (!lyrics) return true;
    return element.lyricsAsString()?.toLowerCase().includes(lyrics?.toLowerCase());
};

const filterByNr = (nr, element) => {
    if (!nr) return true;
    return parseInt(element.nr, 10) === parseInt(nr, 10);
};

const filterByModes = (modes, element) => {
    if (!modes.length) return true;
    return modes.map(m => m?.toLowerCase()).includes(element.mode?.toLowerCase());
};

const filterByTransposition = (transposition, element) => {
    if (!transposition) return true;
    return element.transposition === transposition;
};

const filterByFinalis = (finalis, element) => {
    if (!finalis.length) return true;
    return finalis.map(f => f?.toLowerCase()).includes(element.finalis?.toLowerCase());
};

const filterBySearchText = (searchText, element) => {
    if (!searchText) return true;
    return filterByTitle(searchText, element) || filterByNr(searchText, element) || filterByLyrics(searchText, element);
};

export function useTriciniumFilter(elements) {

    const filter = useFilterStore();

    const filteredElements = computed(() => {
        const filteredElements = elements.filter(element => {
            const composersMatches = filterByComposers(filter.composers, element);
            const titleMatches = filterByTitle(filter.title, element);
            const lyricsMatches = filterByLyrics(filter.lyrics, element);
            const nrMatches = filterByNr(filter.nr, element);
            const modesMatched = filterByModes(filter.modes, element);
            const transpositionMatched = filterByTransposition(filter.transposition, element);
            const clefsMatched = filterByClefs(filter.clefs, element);
            const finalisMatched = filterByFinalis(filter.finalis, element);
            const searchTextMatched = filterBySearchText(filter.searchText, element);

            return (
                composersMatches &&
                titleMatches &&
                lyricsMatches &&
                nrMatches &&
                modesMatched &&
                transpositionMatched &&
                finalisMatched &&
                searchTextMatched
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
