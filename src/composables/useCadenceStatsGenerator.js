import { storeToRefs } from 'pinia';

export function useCadenceStatsGenerator(elements) {
    const statsDimensionOptions = useStatsDimensionStore();
    const { t } = useI18n();

    const { dimension } = storeToRefs(statsDimensionOptions);

    const elementsGroupedByDimension = computed(() => {
        return elements.value.reduce((accumulator, cadence) => {
            let index = accumulator.findIndex((d) => d.label === (dimension.value ? cadence.tricinium[dimension.value] : t('total')));
            if (index === -1) {
                index = -1 + accumulator.push({
                    label: dimension.value ? cadence.tricinium[dimension.value] : t('total'),
                    items: [],
                });
            }
            accumulator[index].items.push(cadence);
            return accumulator;
        }, []);
    });

    const dimensionIsActive = computed(() => dimension.value && dimension.value !== 'total');

    const items = computed(() => {
        const cadences = [];

        if (dimensionIsActive.value) {
            elementsGroupedByDimension.value.forEach(elem => {
                const item = {};
                item.label = elem.label;
                item.total = elem.items.length;
                Array.from({ length: 7 }, (_, i) => i + 1).forEach(n => {
                    item[n] = elem.items.filter(cadence => cadence.degree === n).length;
                });
                cadences.push(item);
            });
        } else {
            const item = {};
            item.total = elements.value.length;
            Array.from({ length: 7 }, (_, i) => i + 1).forEach(n => {
                item[n] = elements.value.filter(cadence => cadence.degree === n).length;
            });
            cadences.push(item);
        }

        return cadences;
    });

    const headers = computed(() => {
        const th = [];
        if (dimensionIsActive.value) {
            th.push({
                value: 'label',
                text: t(dimension.value),
            });
        }
        th.push(...Array.from({ length: 7 }, (_, i) => i + 1).map(n => ({
            value: n,
            text: romanize(n),
        })));
        th.push({
            value: 'total',
            text: t('total'),
        });
        return th;
    });

    return {
        dimension,
        items,
        headers,
    };
}
