<script setup>
import StatisticsIndexPage from './index.page.vue';
import Heading from '../../components/Heading.vue';
import Chart from '../../components/Chart.vue';
import { computed } from 'vue';
import colors from 'tailwindcss/colors';

const props = defineProps(['tricinia']);

const options = computed(() => {
    return {
        type: 'bar',
        data: {
            datasets: clefDatasets.value,
        },
        options:  {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                    },
                },
            },
        },
    };
});

const dimension = 'composer';

const filteredTricinia = computed(() => props.tricinia);

const filteredTriciniaDatasets = computed(() => {
    return filteredTricinia.value.reduce((previousValue, tricinium) => {
        let index = previousValue.findIndex(d => d.label === (dimension ? tricinium[dimension] : 'All'));
        if(index === -1) {
            index = -1 + previousValue.push({
                label: dimension ? tricinium[dimension] : 'All',
                data: [],
            });
        }
        previousValue[index].data.push(tricinium);
        return previousValue;
    }, []);
});

const clefDatasets = computed(() => {
    return filteredTriciniaDatasets.value.map(dataset => {
        return {...dataset, data: dataset.data.reduce((previousValue, tricinium) => {
            const voiceClefs = Object.entries(tricinium.voices || []).map(([,voice]) => voice.clef) || [];
            const x = voiceClefs.join(', ');
            let index = previousValue.findIndex(d => d.x === x);
            if(index === -1) {
                index = -1 + previousValue.push({
                    x,
                    y: 0,
                });
            }
            previousValue[index].y++;
            return previousValue;
        }, [])};
    });
});
</script>

<template>
    <StatisticsIndexPage>
        <Heading>Clef statistics</Heading>
        <Chart :options="options"/>
        <pre v-text="props.tricinia"></pre>
    </StatisticsIndexPage>
</template>
