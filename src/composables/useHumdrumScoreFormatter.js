import { ref, computed, readonly } from 'vue';

export function useHumdrumScoreFormatter(data, options) {
    const filterPrefix = '!!!filter: ';

    const showFilterPrefix = false;

    const filters = ref([
        'cint -O --search "3 2 3"',
        'cint -O --search "3 -2 3"',
    ]);

    function addFilter(item) {
        if (!filters.value.includes(item)) {
            filters.value.push(item);
        }
    }

    function removeFilter(item) {
        filters.value = filters.value.filter((value) => value !== item);
    }

    const filtersAsString = computed({
        get() {
            return filters.value.map((f) => (showFilterPrefix ? `${filterPrefix}${f}` : f)).join('\n');
        },
        set(value) {
            filters.value = value.split('\n').map((line) => {
                line = showFilterPrefix ? line.replace(new RegExp(`/${filterPrefix}/`), '') : line;
                return line.trim();
            });
        },
    });

    const prefixedFiltersAsString = computed(() => {
        return filters.value.map((f) => `${filterPrefix}${f}`).join('\n'); 
    });

    const formattedScoreData = computed(() => {
        return `${prefixedFiltersAsString.value}\n${data.value}`.replace(/^\s+|\s+$/g, '');
    });

    return {
        filters: readonly(filters),
        filtersAsString,
        formattedScoreData: readonly(formattedScoreData),
    }
};
