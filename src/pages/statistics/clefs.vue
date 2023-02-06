<script setup>
const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

useHead({
    title: `${t('clefs')} | ${t('statistics')}`,
});

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
    <div>
        <Heading>{{ $t('clefs')}}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <div class="my-4">
            {{ $t('nOutOfTotalTriciniaFoundForSerachParams', { n: filteredElements.length, total: tricinia.length }) }}
        </div>
        <div class="aspect-w-16 aspect-h-9">
            <Chart :config="config" />
        </div>
        <div class="my-4">
            <DataTable :headers="headers" :items="items"></DataTable>
        </div>
    </div>
</template>
