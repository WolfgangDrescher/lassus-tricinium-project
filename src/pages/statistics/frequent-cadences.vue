<script setup>
import { storeToRefs } from 'pinia';

const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

const filterOptions = reactive({
    ignoreUltima: true,
    ignoreAccidentals: true,
    ignoreUnaccentedBeats: true,
    voices: ['bassus', 'tenor', 'cantus'],
    ignoreFbInterval: true,
    ignoreFbIntervalOrder: true,
    ignoreScaleDegree: false,
    ignoreScaleDegreeOrder: false,
});

useHead({
    title: `${t('frequentCadences')} | ${t('statistics')}`,
});

defineI18nRoute({
    paths: {
        de: '/statistiken/haeufige-kadenzen',
    },
});

const { data: cadenceData } = await useAsyncData('cadences', () => queryContent('/cadences').find());
const { data: triciniumData } = await useFetch('/api/tricinium');
const tricinia = useTricinium(triciniumData.value);
const cadences = useCadence(cadenceData.value, tricinia);
const { filteredElements } = useCadenceFilter(cadences);


function getCadenceStringified(cadence) {
    let slices = [...cadence.slices];
    if (filterOptions.ignoreUnaccentedBeats) {
        slices = slices.filter(slice => (slice.beat % 2 === 0));
    }
    if (filterOptions.ignoreUltima) {
        slices = slices.slice(0, slices.length - 1);
    }
    const voices = ['bassus', 'tenor', 'cantus'];
    return slices.map((slice) => {
        let key = `beat[${slice.beat}]`;
        if (!filterOptions.ignoreScaleDegree) {
            const items = voices.map(voice => filterOptions.voices.includes(voice) ? slice[voice].scaleDegree.replace('_', '') : '');
            if (filterOptions.ignoreScaleDegreeOrder) {
                items.sort();
            }
            key += `deg[${items}]`;
        }
        if (!filterOptions.ignoreFbInterval) {
            const items = voices.map(voice => filterOptions.voices.includes(voice) ? slice[voice].fbInterval : '');
            if (filterOptions.ignoreFbIntervalOrder) {
                items.sort();
            }
            key += `fb[${items}]`;
        }
        if (filterOptions.ignoreAccidentals) {
            key = key.replace(/[+#\-]/g, '');
        }
        return key;
    }).join(';');
}

const voicesOptions = [
    {
        value: 'bassus',
        text: t('voice.bassus'),
    },
    {
        value: 'tenor',
        text: t('voice.tenor'),
    },
    {
        value: 'cantus',
        text: t('voice.cantus'),
    },
];


const cadenceKeys = computed(() => {
    return filteredElements.value.reduce((acc, cadence) => {
        acc[cadence.id] = getCadenceStringified(cadence);
        return acc;
    }, {});
});

const cadenceGroups = computed(() => {
    const cadenceTypes = [...new Set(Object.values(cadenceKeys.value))]
    return cadenceTypes.map((key) => {
        return {
            key,
            cadences: filteredElements.value.filter(cadence => cadenceKeys.value[cadence.id] === key),
        };
    }).sort((a, b) => b.cadences.length - a.cadences.length);
});

const { items, addItems } = useArrayLoader(cadenceGroups);

const { showModernClefs, showIntervallsatz, showScaleDegrees, showLyrics } = storeToRefs(useCadenceHumdrumFiltersStore());

</script>

<template>
    <div>
        <Heading>{{ $t('frequentCadences') }}</Heading>

        <CadenceFilter />
        
        <div class="flex items-center">
            {{ $t('nOutOfTotalCadencesFoundForSerachParams', { n: filteredElements.length, total: cadences.length }) }}
        </div>

        <div class="grid md:grid-cols-3 gap-2 mb-2">
            <div>
                <FormCheckbox v-model="filterOptions.ignoreAccidentals" :label="$t('ignoreAccidentals')" group-label="" />
            </div>
            <div>
                <FormCheckbox v-model="filterOptions.ignoreUltima" :label="$t('ignoreUltima')" group-label="" />
            </div>
            <div>
                <FormCheckbox v-model="filterOptions.ignoreUnaccentedBeats" :label="$t('ignoreUnaccentedBeats')" group-label="" />
            </div>
            <div>
                <FormCheckbox v-model="filterOptions.ignoreFbInterval" :label="$t('ignoreFbInterval')" group-label="" />
            </div>
            <div :class="filterOptions.ignoreFbInterval ? 'opacity-20' : ''">
                <FormCheckbox v-model="filterOptions.ignoreFbIntervalOrder" :label="$t('ignoreFbIntervalOrder')" group-label="" />
            </div>
            <div>
                <FormCheckbox v-model="filterOptions.ignoreScaleDegree" :label="$t('ignoreScaleDegree')" group-label="" />
            </div>
            <div :class="filterOptions.ignoreScaleDegree ? 'opacity-20' : ''">
                <FormCheckbox v-model="filterOptions.ignoreScaleDegreeOrder" :label="$t('ignoreScaleDegreeOrder')" group-label="" />
            </div>
            <div class="w-64">
                <FormDropdown v-model="filterOptions.voices" multiple :options="voicesOptions" :label="$t('voices')" :search-enabled="false" />
            </div>
        </div>

        <div class="flex items-center my-6">
            {{ $t('nCadencesTypesFound', { n: items.length }) }}
        </div>

        <div class="my-4 flex flex-col md:flex-row gap-4">
            <div>
                <FormCheckbox v-model="showModernClefs" :label="$t('showModernClefs')" />
            </div>
            <div>
                <FormCheckbox v-model="showIntervallsatz" :label="$t('showIntervallsatz')" />
            </div>
            <div>
                <FormCheckbox v-model="showScaleDegrees" :label="$t('showScaleDegrees')" />
            </div>
            <div>
                <FormCheckbox v-model="showLyrics" :label="$t('showLyrics')" />
            </div>
        </div>

        <InfiniteScroll @load="addItems(1)" :all="items.length === cadenceGroups.length">
            <div v-for="item in items.slice(0, 50)" :key="item.id" class="mt-8">
                <div class="flex items-center gap-4 group">
                    <div>
                        <Heading>{{ item.cadences.length }}x</Heading>
                    </div>
                    <div class="ml-auto text-xs text-transparent group-hover:text-gray-500">
                        <code v-text="item.key"></code>
                    </div>
                </div>
                <CadenceSwiper :cadences="item.cadences" :key="item.key" />
            </div>
        </InfiniteScroll>

    </div>
</template>
