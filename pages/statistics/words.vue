<script setup>
import StatisticsIndexPage from './index.vue';
const { t } = useI18n();

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/woerter',
    },
});

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(
    filteredElements,
    tricinium => tricinium.normalizedLyrics.split(' '),
    (a, b) => b.y - a.y,
    10,
);
const { headers, items } = useDatasetTransformer(datasets, t('word'));
</script>

<template>
    <StatisticsIndexPage>
        <Heading>{{ $t('words')}}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <Chart :config="config" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
