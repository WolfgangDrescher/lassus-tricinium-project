<script setup>
const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

const filter = useTriciniumFilterStore();
const { t } = useI18n();

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

const modeOptions = [...new Set(tricinia.map(tricinium => tricinium.mode).filter(n => n))].map(mode => ({
    value: mode,
    text: t(`mode.${mode}`),
}));

const transpositionOptions = [...new Set(tricinia.map(tricinium => tricinium.transposition).filter(n => n))].map(transposition => ({
    value: transposition,
    text: t(`transposition.${transposition}`),
}));

const clefsOptions = [...new Set(tricinia.map(tricinium => tricinium.clefs).filter(n => n))].map(clefs => ({
    value: clefs,
    text: clefs,
}));

const finalisOptions = [...new Set(tricinia.map(tricinium => tricinium.finalis).filter(n => n))].map(finalis => ({
    value: finalis,
    text: finalis,
}));

const cantusFirmusOptions = [...new Set(tricinia.map(tricinium => tricinium.cantusFirmusAsString).filter(n => n))].map(cantusFirmus => {
    const voices = cantusFirmus.split(',').map(cf => cf.trim());
    return {
        value: cantusFirmus,
        text: voices.map(voice => t(`cantusFirmus.${voice}`)).join(', '),
    };
});
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
                <FormDropdown :model-value="filter.modes" @update:model-value="updateFilter('modes', $event)" :label="$t('mode')" :options="modeOptions" :search-enabled="false" :multiple="true"/>
            </div>
            <div>
                <FormDropdown :model-value="filter.transposition" @update:model-value="updateFilter('transposition', $event)" :label="$t('transposition')" :options="transpositionOptions" :search-enabled="false" />
            </div>
            <div>
                <FormDropdown :model-value="filter.clefs" @update:model-value="updateFilter('clefs', $event)" :label="$t('clefs')" :options="clefsOptions" :search-enabled="false" :multiple="true" />
            </div>
            <div>
                <FormDropdown :model-value="filter.finalis" @update:model-value="updateFilter('finalis', $event)" :label="$t('finalis')" :options="finalisOptions" :search-enabled="false" :multiple="true"/>
            </div>
            <div>
                <FormDropdown :model-value="filter.cantusFirmus" @update:model-value="updateFilter('cantusFirmus', $event)" :label="$t('cantusFirmus')" :options="cantusFirmusOptions" :search-enabled="false" :multiple="true" />
            </div>
            <div>
                <FormGroup :label="''">
                    <Button @click="resetFilter" block>{{ $t('reset') }}</Button>
                </FormGroup>
            </div>
        </div>
    </ClientOnly>
</template>
