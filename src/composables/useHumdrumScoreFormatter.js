import { ref, computed, readonly } from 'vue';


export function useHumdrumScoreFormatter(data,) {

    const filters = ref([]);

    function addFilter(filter) {
        if (filter.unique) {
            const matchedFilter = filters.value.find((f) => f.className === filter.className);
            if (matchedFilter && filter.changeable) {
                removeFilter(matchedFilter.id);
            } else if (matchedFilter) {
                throw new Error(`Filter ${filter.className} is unique and already in use.`);
            }
        }
        filters.value.push(filter);
    }

    function removeFilter(filterId) {
        filters.value = filters.value.filter(f => f.id !== filterId);
    }

    const filtersAsString = computed(() => {
        const sortedFilters = [...filters.value].sort((a, b) => {
            return a.priority > b.priority ? -1 : 1;
        });
        return sortedFilters.map((f) => f.toString()).join('\n');
    });

    const formattedScoreData = computed(() => {
        return `${filtersAsString.value}\n${data.value}`.replace(/^\s+|\s+$/g, '');
    });

    return {
        addFilter,
        removeFilter,
        filters: readonly(filters),
        filtersAsString: readonly(filtersAsString),
        formattedScoreData: readonly(formattedScoreData),
    };
}
