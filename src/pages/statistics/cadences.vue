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
const { datasets, config } = useChartGenerator(
    filteredElements,
    (c) => romanize(c.degree),
    (a, b) => a.x > b.x ? 1 : -1,
    undefined,
    undefined,
    (element, dimension) => element.tricinium[dimension],
    (data) => {
        Array.from({ length: 7 }, (_, i) => romanize(i + 1)).forEach(n => {
            if (data.findIndex(i => i.x === n) === -1) {
                data.push({
                    x: n,
                    y: 0,
                });
            }
        });
    },
);
</script>

<template>
    <div>
        <Heading>{{ $t('cadences')}}</Heading>
        <CadenceFilter />
        <ChartDimensionSelector v-model="dimension" />
        <div class="my-4">
            {{ $t('nOutOfTotalCadencesFoundForSerachParams', { n: filteredElements.length, total: cadences.length }) }}
        </div>
        <div class="aspect-w-16 aspect-h-9">
            <Chart :config="config" />
        </div>
        <DataTable :headers="headers" :items="items"></DataTable>
    </div>
</template>
