import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useChartStore } from '../stores/chart';

export function useChartGenerator(elements, filterValue, compareFunction, maxDatasetLength) {
    const chartOptions = useChartStore();

    const { dimension } = storeToRefs(chartOptions);

    const elementsGroupedByDimension = computed(() => {
        return elements.value.reduce((previousValue, tricinium) => {
            let index = previousValue.findIndex((d) => d.label === (dimension.value ? tricinium[dimension.value] : 'All'));
            if (index === -1) {
                index = -1 + previousValue.push({
                    label: dimension.value ? tricinium[dimension.value] : 'All',
                    data: [],
                });
            }
            previousValue[index].data.push(tricinium);
            return previousValue;
        }, []);
    });

    const datasets = computed(() => {
        return elementsGroupedByDimension.value.map(dataset => {
            return {
                ...dataset,
                data: dataset.data.reduce((previousValue, tricinium) => {
                    const x = filterValue(tricinium);
                    if (Array.isArray(x)) {
                        x.forEach(item => {
                            if (item) {
                                let index = previousValue.findIndex(d => d.x === item);
                                if (index === -1) {
                                    index = -1 + previousValue.push({
                                        x: item,
                                        y: 0,
                                    });
                                }
                                previousValue[index].y++;
                            }
                        });
                    } else {
                        if (x) {
                            let index = previousValue.findIndex(d => d.x === x);
                            if (index === -1) {
                                index = -1 + previousValue.push({
                                    x,
                                    y: 0,
                                });
                            }
                            previousValue[index].y++;
                        }
                    }
                    return previousValue;
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
