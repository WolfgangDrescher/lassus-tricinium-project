<script setup>
import StatisticsIndexPage from './index.vue';

const tricinia = useTricinium(await $fetch('/api/tricinium'));

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(filteredElements, tricinium => tricinium.finalis);
const { headers, items } = useDatasetTransformer(datasets, 'Finalis');
</script>

<template>
    <StatisticsIndexPage>
        <Heading>Finalis statistics</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <Chart :config="config" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
