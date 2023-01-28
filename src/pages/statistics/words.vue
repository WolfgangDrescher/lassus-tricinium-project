<script setup>
const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

useHead({
    title: `${t('words')} | ${t('statistics')}`,
});

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
    <div>
        <Heading>{{ $t('words')}}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <div class="aspect-w-16 aspect-h-9">
            <Chart :config="config" />
        </div>
        <DataTable :headers="headers" :items="items"></DataTable>
    </div>
</template>
