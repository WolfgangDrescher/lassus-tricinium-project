<script setup>
import StatisticsIndexPage from './index.page.vue';
import Heading from '../../components/Heading.vue';
import Chart from '../../components/Chart.vue';
import TriciniumFilter from '../../components/TriciniumFilter.vue';
import { useTricinium } from '../../composables/useTricinium.js';
import { useTriciniumFilter } from '../../composables/useTriciniumFilter.js';
import { useChartGenerator } from '../../composables/useChartGenerator.js';

const props = defineProps(['tricinia']);

const tricinia = useTricinium(props.tricinia);

const { filteredElements, filter } = useTriciniumFilter(tricinia);
const { config, dimension } = useChartGenerator(filteredElements, (tricinium) => tricinium.mode);
</script>

<template>
    <StatisticsIndexPage>
        <Heading>Clef statistics</Heading>
        <TriciniumFilter :filter="filter"></TriciniumFilter>
            <select
                v-model="dimension"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
            <option value="">all</option>
            <option value="id">id</option>
            <option value="title">title</option>
            <option value="composer">composer</option>
            <option value="mode">mode</option>
            <option value="transposed">transposed</option>
            <option value="clefs">clefs</option>
            <option value="finalis">finalis</option>
        </select>
        <Chart :config="config" />
    </StatisticsIndexPage>
</template>
