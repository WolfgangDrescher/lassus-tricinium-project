<script setup>
import StatisticsIndexPage from './index.vue';
const { t } = useI18n();

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/finalis',
    },
});

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(filteredElements, tricinium => tricinium.finalis);
const { headers, items } = useDatasetTransformer(datasets, t('finalis'));
</script>

<template>
    <StatisticsIndexPage>
        <Heading>{{ $t('finalis') }}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <Chart :config="config" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
