const filterByComposer = (composer, element) => {
    if (!composer) return true;
    return composer.toLowerCase() === element.composer?.toLowerCase();
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

const filterByClefs = (clefs, element) => {
    if (!clefs.length) return true;
    return clefs.map(f => f?.toLowerCase()).includes(element.clefs?.toLowerCase());
};

const filterBySearchText = (searchText, element) => {
    if (!searchText) return true;
    return filterByTitle(searchText, element) || filterByNr(searchText, element) || filterByLyrics(searchText, element);
};

const filterByCantusFirmus = (cantusFirmus, element) => {
    if (!cantusFirmus.length) return true;
    return cantusFirmus.map(c => c?.toLowerCase()).includes(element.cantusFirmusAsString?.toLowerCase());
};

export function useTriciniumFilter(elements) {

    const filter = useTriciniumFilterStore();

    const filteredElements = computed(() => {
        const filteredElements = elements.filter(element => {
            const composerMatches = filterByComposer(filter.composer, element);
            const titleMatches = filterByTitle(filter.title, element);
            const lyricsMatches = filterByLyrics(filter.lyrics, element);
            const nrMatches = filterByNr(filter.nr, element);
            const modesMatched = filterByModes(filter.modes, element);
            const transpositionMatched = filterByTransposition(filter.transposition, element);
            const clefsMatched = filterByClefs(filter.clefs, element);
            const finalisMatched = filterByFinalis(filter.finalis, element);
            const searchTextMatched = filterBySearchText(filter.searchText, element);
            const cantusFirmusMatched = filterByCantusFirmus(filter.cantusFirmus, element);

            return (
                composerMatches &&
                titleMatches &&
                lyricsMatches &&
                nrMatches &&
                modesMatched &&
                transpositionMatched &&
                clefsMatched &&
                finalisMatched &&
                searchTextMatched &&
                cantusFirmusMatched
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
