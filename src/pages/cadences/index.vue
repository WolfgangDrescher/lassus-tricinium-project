<script setup>
import { storeToRefs } from 'pinia';

const { t } = useI18n();
useHead({
    title: t('cadences'),
});

defineI18nRoute({
    paths: {
        de: '/kadenzen',
    },
});

const { data: cadenceData } = await useAsyncData('cadences', () => queryContent('/cadences').find())
const { data: triciniumData } = await useFetch('/api/tricinium');
const tricinia = useTricinium(triciniumData.value);

const cadences = useCadence(cadenceData.value, tricinia);

const { filteredElements } = useCadenceFilter(cadences);
const { items, addItems } = useArrayLoader(filteredElements);

const store = useCadenceHumdrumFiltersStore();
const { showModernClefs, showIntervallsatz, showLyrics } = storeToRefs(store)
</script>

<template>
    <Container>
        <Heading>{{ $t('cadences') }}</Heading>

        <CadenceFilter />
        
        <div class="my-4 flex flex-col md:flex-row gap-4">
            <div class="flex items-center">
                {{ $t('nOutOfTotalCadencesFoundForSerachParams', { n: filteredElements.length, total: cadences.length }) }}
            </div>
            <div class="ml-auto flex gap-4 items-center">
                <div>
                    <FormCheckbox v-model="showModernClefs" :label="$t('showModernClefs')" />
                </div>
                <div>
                    <FormCheckbox v-model="showIntervallsatz" :label="$t('showIntervallsatz')" />
                </div>
                <div>
                    <FormCheckbox v-model="showLyrics" :label="$t('showLyrics')" />
                </div>
            </div>
        </div>

        <InfiniteScroll @load="addItems()" :all="items.length === filteredElements.length">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div v-for="cadence in items" :key="cadence.id">
                    <CadenceListItem :cadence="cadence" />
                </div>
            </div>
        </InfiniteScroll>
    </Container>
</template>
