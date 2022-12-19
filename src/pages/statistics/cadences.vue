<script setup>
import StatisticsIndexPage from './index.vue';
const { t } = useI18n();

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
    <StatisticsIndexPage>
        <Heading>{{ $t('words')}}</Heading>
        <CadenceFilter />
        <ChartDimensionSelector v-model="dimension" />
        <DataTable :headers="headers" :items="items"></DataTable>
    </StatisticsIndexPage>
</template>
