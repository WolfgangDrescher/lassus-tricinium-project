<script setup>
const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

useHead({
    title: `${t('cantusFirmus')} | ${t('statistics')}`,
});

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/cantus-firmus',
    },
});

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(filteredElements, tricinium => tricinium.cantusFirmus, undefined, undefined, (value) => value && t(`cantusFirmus.${value}`));
const { headers, items } = useDatasetTransformer(datasets, t('cantusFirmus'));
</script>

<template>
    <div>
        <Heading>{{ $t('cantusFirmus')}}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <div class="aspect-w-16 aspect-h-9">
            <Chart :config="config" />
        </div>
        <DataTable :headers="headers" :items="items"></DataTable>
    </div>
</template>
