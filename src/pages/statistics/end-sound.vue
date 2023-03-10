<script setup>
const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

useHead({
    title: `${t('endSound')} | ${t('statistics')}`,
});

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/schlussklang',
    },
});

const withinOctave = ref(true);
const accidentals = ref(true);
const sort = ref(true);

const { filteredElements } = useTriciniumFilter(tricinia);
const { datasets, config, dimension } = useChartGenerator(filteredElements, tricinium => {
    return tricinium.getEndSound(withinOctave.value, accidentals.value, sort.value)
});
const { headers, items } = useDatasetTransformer(datasets, t('endSound'));
</script>

<template>
    <div>
        <Heading>{{ $t('endSound') }}</Heading>
        <TriciniumFilter />
        <ChartDimensionSelector v-model="dimension" />
        <div class="my-4">
            {{ $t('nOutOfTotalTriciniaFoundForSerachParams', { n: filteredElements.length, total: tricinia.length }) }}
        </div>
        <div>
            <div class="grid md:grid-cols-2 gap-2 mb-2">
                <FormCheckbox v-model="withinOctave" :label="$t('intervalsWithinOctave')" />
                <FormCheckbox v-model="accidentals" :label="$t('showIntervals')" />
                <FormCheckbox v-model="sort" :label="$t('sortNumbers')" />
            </div>
        </div>
        <div class="aspect-w-16 aspect-h-9">
            <Chart :config="config" />
        </div>
        <div class="my-4">
            <DataTable :headers="headers" :items="items"></DataTable>
        </div>
    </div>
</template>
