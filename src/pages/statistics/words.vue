<script setup>
import StatisticsIndexPage from './index.vue';
import Heading from '../../components/Heading.vue';
import Chart from '../../components/Chart.vue';
import TriciniumFilter from '../../components/TriciniumFilter.vue';
import DataTable from '../../components/DataTable.vue';
import ChartDimensionSelector from '../../components/ChartDimensionSelector.vue';
import { useTricinium } from '../../composables/useTricinium.js';
import { useTriciniumFilter } from '../../composables/useTriciniumFilter.js';
import { useChartGenerator } from '../../composables/useChartGenerator.js';
import { useDatasetTransformer } from '../../composables/useDatasetTransformer.js';

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
