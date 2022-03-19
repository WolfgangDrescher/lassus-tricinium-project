import { computed, ref } from 'vue';

export function useChartGenerator(elements, filterValue) {
    const dimension = ref('composer');

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
        return elementsGroupedByDimension.value.map((dataset) => {
            return {
                ...dataset,
                data: dataset.data.reduce((previousValue, tricinium) => {
                    const x = filterValue(tricinium);
                    let index = previousValue.findIndex((d) => d.x === x);
                    if (index === -1) {
                        index = -1 + previousValue.push({
                            x,
                            y: 0,
                        });
                    }
                    previousValue[index].y++;
                    return previousValue;
                }, []),
            };
        });
    });

    const config = computed(() => ({
        type: 'bar',
        data: {
            datasets: datasets.value,
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
        datasets,
        config,
    };
}
