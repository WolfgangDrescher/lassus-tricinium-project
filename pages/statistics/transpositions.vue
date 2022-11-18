<script setup>
import StatisticsIndexPage from './index.vue';

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/transpositionen',
    },
});

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(filteredElements, tricinium => tricinium.transposed);
const { headers, items } = useDatasetTransformer(datasets, 'Transposition');
</script>

<template>
    <StatisticsIndexPage>
        <Heading>{{ $t('transpositions') }}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <Chart :config="config" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
