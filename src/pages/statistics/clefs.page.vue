<script setup>
import StatisticsIndexPage from './index.page.vue';
import Heading from '../../components/Heading.vue';
import Chart from '../../components/Chart.vue';
import TriciniumFilter from '../../components/TriciniumFilter.vue';
import DataTable from '../../components/DataTable.vue';
import ChartDimensionSelector from '../../components/ChartDimensionSelector.vue';
import { useTricinium } from '../../composables/useTricinium.js';
import { useTriciniumFilter } from '../../composables/useTriciniumFilter.js';
import { useChartGenerator } from '../../composables/useChartGenerator.js';
import { useDatasetTransformer } from '../../composables/useDatasetTransformer.js';

const props = defineProps(['tricinia']);

const tricinia = useTricinium(props.tricinia);

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(filteredElements, tricinium => tricinium.clefs);
const { headers, items } = useDatasetTransformer(datasets, 'Clefs');
</script>

<template>
    <StatisticsIndexPage>
        <Heading>Clef statistics</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <Chart :config="config" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
