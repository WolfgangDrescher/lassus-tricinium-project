<script setup>
import StatisticsIndexPage from './index.vue';

const tricinia = useTricinium(await $fetch('/api/tricinium'));

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(
    filteredElements,
    tricinium => tricinium.normalizedLyrics.split(' '),
    (a, b) => b.y - a.y,
    10,
);
const { headers, items } = useDatasetTransformer(datasets, 'Word');
</script>

<template>
    <StatisticsIndexPage>
        <Heading>Word statistics</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <Chart :config="config" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
