<script setup>
const { data: cadenceData } = await useAsyncData('cadences', () => queryContent('/cadences').find())
const { data: triciniumData } = await useFetch('/api/tricinium');
const tricinia = useTricinium(triciniumData.value);
const cadences = useCadence(cadenceData.value, tricinia);

const filter = useCadenceFilterStore();

function updateFilter(prop, value) {
    filter.update(prop, value);
}

function resetFilter() {
    filter.reset();
}

const composerOptions = [...new Set(tricinia.map(tricinium => tricinium.composer).filter(n => n))].map(composer => ({
    value: composer,
    text: composer,
}));

const finalisOptions = [...new Set(tricinia.map(tricinium => tricinium.finalis).filter(n => n))].map(finalis => ({
    value: finalis,
    text: finalis,
}));

const degreeOptions = [...new Set(cadences.map(cadence => cadence.degree).filter(n => n))].map(degree => ({
    value: degree,
    text: romanize(degree),
}));

const ultimaOptions = [...new Set(cadences.map(cadence => cadence.ultima).filter(n => n))].map(ultima => ({
    value: ultima,
    text: ultima,
}));
</script>

<template>
    <ClientOnly>
        <div class="grid grid-cols-filter gap-4 mb-4">
            <div>
                <FormInputField :model-value="filter.searchText" @update:model-value="updateFilter('searchText', $event)" :label="$t('searchText')" :placeholder="$t('titleNumberLyrics')" />
            </div>
            <div>
                <FormDropdown :model-value="filter.composer" @update:model-value="updateFilter('composer', $event)" :label="$t('composer')" :options="composerOptions" :search-enabled="false" />
            </div>
            <div>
                <FormDropdown :model-value="filter.finalis" @update:model-value="updateFilter('finalis', $event)" :label="$t('finalis')" :options="finalisOptions" :search-enabled="false" :multiple="true"/>
            </div>
            <div>
                <FormDropdown :model-value="filter.degrees" @update:model-value="updateFilter('degrees', $event)" :label="$t('degree')" :options="degreeOptions" :search-enabled="false" :multiple="true" />
            </div>
            <div>
                <FormDropdown :model-value="filter.ultimas" @update:model-value="updateFilter('ultimas', $event)" :label="$t('ultima')" :options="ultimaOptions" :search-enabled="false" :multiple="true" />
            </div>
            <div>
                <FormGroup :label="''">
                    <Button @click="resetFilter" block>{{ $t('reset') }}</Button>
                </FormGroup>
            </div>
        </div>
    </ClientOnly>
</template>
