<script setup>
import StatisticsIndexPage from './index.vue';
const { t } = useI18n();

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/schluessel',
    },
});

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(filteredElements, tricinium => tricinium.clefs);
const { headers, items } = useDatasetTransformer(datasets, t('clefs'));
</script>

<template>
    <StatisticsIndexPage>
        <Heading>{{ $t('clefs')}}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <Chart :config="config" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
