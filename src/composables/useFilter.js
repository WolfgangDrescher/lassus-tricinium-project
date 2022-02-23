import { computed } from 'vue';

const filterByComposer = (filter, element) => {
    if (!filter.composer) return true;
    return element.composer === filter.composer;
};

const filterByTitle = (filter, element) => {
    if (!filter.title) return true;
    return element.title.toLowerCase().includes(filter.title.toLowerCase());
};

const filterByNr = (filter, element) => {
    if (!filter.nr) return true;
    return parseInt(element.nr, 10) === parseInt(filter.nr, 10);
};

export function useFilter(elements, filter) {
    function applyFilter() {
        const filteredElements = elements.filter((element) => {
            const composerMatches = filterByComposer(filter, element);
            const titleMatches = filterByTitle(filter, element);
            const nrMatches = filterByNr(filter, element);

            return composerMatches && titleMatches && nrMatches;
        });

        filteredElements.sort((a, b) => {
            if (filteredElements.orderBy === 'id') {
                return a.id > b.id ? 1 : -1;
            }
            return 0;
        });

        return filteredElements;
    }

    const filteredElements = computed(() => {
        return applyFilter();
    });

    return {
        filteredElements,
    };
}
