<script setup>
const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

useHead({
    title: `${t('cadences')} | ${t('statistics')}`,
});

const { data: cadenceData } = await useAsyncData('cadences', () => queryContent('/cadences').find());
const { data: triciniumData } = await useFetch('/api/tricinium');
const tricinia = useTricinium(triciniumData.value);
const cadences = useCadence(cadenceData.value, tricinia);

defineI18nRoute({
    paths: {
        de: '/statistiken/kadenzen',
    },
});

const { filteredElements } = useCadenceFilter(cadences);

const { items, headers, dimension } = useCadenceStatsGenerator(filteredElements);
</script>

<template>
    <div>
        <Heading>{{ $t('words')}}</Heading>
        <CadenceFilter />
        <ChartDimensionSelector v-model="dimension" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </div>
</template>
