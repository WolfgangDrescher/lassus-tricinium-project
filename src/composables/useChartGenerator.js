import { storeToRefs } from 'pinia';

export function useChartGenerator(elements, filterValue, compareFunction, maxDatasetLength, valueTransformer) {
    const statsDimensionOptions = useStatsDimensionStore();
    const { t } = useI18n();

    const { dimension } = storeToRefs(statsDimensionOptions);

    const elementsGroupedByDimension = computed(() => {
        return elements.value.reduce((accumulator, tricinium) => {
            let index = accumulator.findIndex((d) => d.label === (dimension.value ? tricinium[dimension.value] : t('all')));
            if (index === -1) {
                index = -1 + accumulator.push({
                    label: dimension.value ? tricinium[dimension.value] : t('all'),
                    data: [],
                });
            }
            accumulator[index].data.push(tricinium);
            return accumulator;
        }, []);
    });

    const formatValue = (value) => {
        return typeof valueTransformer === 'function' ? valueTransformer(value) : value;
    };

    const datasets = computed(() => {
        return elementsGroupedByDimension.value.map(dataset => {
            return {
                ...dataset,
                data: dataset.data.reduce((accumulator, tricinium) => {
                    const x = filterValue(tricinium);
                    if (Array.isArray(x)) {
                        x.forEach(item => {
                            if (item) {
                                let index = accumulator.findIndex(d => d.x === formatValue(item));
                                if (index === -1) {
                                    index = -1 + accumulator.push({
                                        x: formatValue(item),
                                        y: 0,
                                    });
                                }
                                accumulator[index].y++;
                            }
                        });
                    } else {
                        if (x) {
                            let index = accumulator.findIndex(d => d.x === formatValue(x));
                            if (index === -1) {
                                index = -1 + accumulator.push({
                                    x: formatValue(x),
                                    y: 0,
                                });
                            }
                            accumulator[index].y++;
                        }
                    }
                    return accumulator;
                }, []),
            };
        });
    });

    const orderedDatasets = computed(() => {
        return datasets.value.map(dataset => {
            return {...dataset, ...{
                data: dataset.data.sort(compareFunction).slice(0, maxDatasetLength || dataset.data.length),
            }};
        });
    });

    const config = computed(() => ({
        type: 'bar',
        data: {
            datasets: orderedDatasets.value,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: !!dimension.value,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                    },
                },
            },
        },
    }));

    return {
        dimension,
        datasets: orderedDatasets,
        config,
    };
}
