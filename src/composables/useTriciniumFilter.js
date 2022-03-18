import { computed, reactive, readonly } from 'vue';

const filterByComposer = (filter, element) => {
    if (!filter.composer) return true;
    return element.composer.toLowerCase().includes(filter.composer.toLowerCase());
};

const filterByTitle = (filter, element) => {
    if (!filter.title) return true;
    return element.title.toLowerCase().includes(filter.title.toLowerCase());
};

const filterByLyrics= (filter, element) => {
    if (!filter.lyrics) return true;
    return element.lyricsAsString().toLowerCase().includes(filter.lyrics.toLowerCase());
};

const filterByNr = (filter, element) => {
    if (!filter.nr) return true;
    return parseInt(element.nr, 10) === parseInt(filter.nr, 10);
};

const filterByMode = (filter, element) => {
    if (!filter.mode) return true;
    return element.mode.toLowerCase() === filter.mode.toLowerCase();
};

const filterByTransposed = (filter, element) => {
    if (!filter.transposed) return true;
    return element.transposed === (filter.transposed === 'true');
};

const filterByFinalis = (filter, element) => {
    if (!filter.finalis) return true;
    return element.finalis.toLowerCase() === filter.finalis.toLowerCase();
};

export function useTriciniumFilter(elements) {

    const filter = reactive({
        composer: null,
        title: null,
        lyrics: null,
        nr: null,
        mode: null,
        transposed: null,
        finalis: null,
        clefs: null,
    });

    const filteredElements = computed(() => {
        const filteredElements = elements.filter((element) => {
            console.log({...filter}, element);
            const composerMatches = filterByComposer(filter, element);
            const titleMatches = filterByTitle(filter, element);
            const lyricsMatches = filterByLyrics(filter, element);
            const nrMatches = filterByNr(filter, element);
            const modeMatched = filterByMode(filter, element);
            const transposedMatched = filterByTransposed(filter, element);
            const finalisMatched = filterByFinalis(filter, element);

            return (
                composerMatches &&
                titleMatches &&
                lyricsMatches &&
                nrMatches &&
                modeMatched &&
                transposedMatched &&
                finalisMatched
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
        filteredElements: readonly(filteredElements),
        filter: filter,
    };
}
