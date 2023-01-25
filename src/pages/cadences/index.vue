<script setup>
import { storeToRefs } from 'pinia';

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

const store = useCadenceHumdrumFiltersStore();
const { showModernClefs, showIntervallsatz, hideLyrics } = storeToRefs(store)
</script>

<template>
    <Container>
        <Heading>{{ $t('cadences') }}</Heading>

        <CadenceFilter />
        
        <div class="my-4 flex">
            <div class="flex items-center">
                {{ $t('nCadencesFoundForSerachParams', filteredElements.length) }}
            </div>
            <div class="ml-auto flex gap-4 items-center">
                <div>
                    <FormCheckbox v-model="showModernClefs" :label="$t('showModernClefs')" />
                </div>
                <div>
                    <FormCheckbox v-model="showIntervallsatz" :label="$t('showIntervallsatz')" />
                </div>
                <div>
                    <FormCheckbox v-model="hideLyrics" :label="$t('hideLyrics')" />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div v-for="cadence in filteredElements" :key="cadence.id">
                <CadenceListItem :cadence="cadence" />
            </div>
        </div>
    </Container>
</template>
