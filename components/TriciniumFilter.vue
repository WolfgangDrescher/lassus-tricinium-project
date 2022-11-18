<script setup>
const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

const filter = useFilterStore();
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
    text: t(`mode.${mode}`)
}));

const transpositionOptions = [...new Set(tricinia.map(tricinium => tricinium.transposition).filter(n => n))].map(transposition => ({
    value: transposition,
    text: t(`transposition.${transposition}`)
}));

const finalisOptions = [
    {
        value: 'c',
        text: 'c',
    },
    {
        value: 'd',
        text: 'd',
    },
    {
        value: 'e',
        text: 'e',
    },
    {
        value: 'f',
        text: 'f',
    },
    {
        value: 'g',
        text: 'g',
    },
    {
        value: 'a',
        text: 'a',
    },
    {
        value: 'h',
        text: 'h',
    },
];
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
                <FormDropdown :model-value="filter.mode" @update:model-value="updateFilter('mode', $event)" :label="$t('mode')" :options="modeOptions" :search-enabled="false" />
            </div>
            <div>
                <FormDropdown :model-value="filter.transposed" @update:model-value="updateFilter('transposed', $event)" :label="$t('transposition')" :options="transpositionOptions" :search-enabled="false" />
            </div>
            <div>
                <FormDropdown :model-value="filter.finalis" @update:model-value="updateFilter('finalis', $event)" :label="$t('finalis')" :options="finalisOptions" :search-enabled="false" />
            </div>
            <div>
                <FormGroup :label="''">
                    <Button @click="resetFilter" block>{{ $t('reset') }}</Button>
                </FormGroup>
            </div>
        </div>
    </ClientOnly>
</template>
