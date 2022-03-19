import { computed } from 'vue';


export function useDatasetTransformer(datasets, title) {

    const headers = computed(() => {
        return [title, ...datasets.value.map((dataset) => dataset.label)];
    });

    function normalizeItems(items) {
        const props = items.reduce((accumulator, currentValue) => {
            return Object.keys(currentValue).reduce((_, currentKey) => {
                if (!accumulator.includes(currentKey)) {
                    accumulator.push(currentKey);
                }
                return accumulator;
            }, []);
        }, []);
        return items.reduce((accumulator, currentValue) => {
            accumulator.push({
                ...props.reduce((a, v) => ({ ...a, [v]: null}), {}),
                ...currentValue
            });
            return accumulator
        }, []);
    }

    const items = computed(() => {
        return normalizeItems(datasets.value.reduce((accumulator, currentItem) => {
            return currentItem.data.reduce((_, currentDataItem) => {
                const index = accumulator.findIndex(i => {
                    return i._index === currentDataItem.x;
                });
                if (index >= 0) {
                    const prop = accumulator[index][currentItem.label];
                    if(prop) {
                        accumulator[index][currentItem.label] += currentDataItem.y;
                    } else {
                        accumulator[index][currentItem.label] = currentDataItem.y;
                    }
                } else {
                    accumulator.push({
                        _index: currentDataItem.x,
                        [currentItem.label]: currentDataItem.y,
                    });
                }
                return accumulator;
            }, []);
        }, []));
    });

    return {
        headers,
        items,
    };
}
