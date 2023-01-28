<script setup>
import StatisticsIndexPage from './index.vue';
const { t } = useI18n();

useHead({
    title: `${t('transpositions')} | ${t('statistics')}`,
});

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/transpositionen',
    },
});

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(filteredElements, tricinium => tricinium.transposition, undefined, undefined, (value) => value && t(`transposition.${value}`));
const { headers, items } = useDatasetTransformer(datasets, t('transposition'));
</script>

<template>
    <StatisticsIndexPage>
        <Heading>{{ $t('transpositions') }}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <div class="aspect-w-16 aspect-h-9">
            <Chart :config="config" />
        </div>
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
