<script setup>
import {
    ModernClefsFilter,
    MensuralFilter,
    HideLyricsFilter,
    HideEditorialAccidentalsFilter,
    CompositeRhythmFilter,
    MeasureFilter,
    ExtractSpineFilter,
    ExtractVoiceFilter,
    ParallelIntervalsFilter,
    DissonantFilter,
    ClausulaFilter,
    AutobeamFilter,
    ImitationFilter,
    MelismaFilter,
    ShedFilter,
    HideCantusFirmusAnnotationFilter,
    ShowSicWarningsFilter,
    SicFilter,
    TransposeFilter,
    CustomFilter,
    HideBarlinesFilter,
    FiguredbassFilter,
    FiguredbassPresetFilter,
    IntervallsatzPresetFilter,
    ScaleDegreeFilter,
    BassScaleDegreeFilter,
    HideSpineDataFilter,
    ShowAllMeasureNumbersFilter,
    TieSplitFilter,
    ClefsFilter,
} from '../../classes/HumdrumFilters.js';

defineProps({
    filters: Array,
    expertMode: {
        type: Boolean,
        default: false,
    },
    initialFilterString: {
        type: String,
        default: '',
    },
});
const emit = defineEmits([
    'addFilter',
    'removeFilter',
    'update:expertMode',
    'update:manualFilters',
]);

const { t } = useI18n();

const selectedFilter = ref(null);

const allFilters = [
    ModernClefsFilter,
    ClefsFilter,
    IntervallsatzPresetFilter,
    FiguredbassPresetFilter,
    FiguredbassFilter,
    ScaleDegreeFilter,
    BassScaleDegreeFilter,
    MensuralFilter,
    HideLyricsFilter,
    HideEditorialAccidentalsFilter,
    CompositeRhythmFilter,
    MeasureFilter,
    ExtractSpineFilter,
    ExtractVoiceFilter,
    ParallelIntervalsFilter,
    DissonantFilter,
    ClausulaFilter,
    AutobeamFilter,
    ImitationFilter,
    MelismaFilter,
    ShedFilter,
    HideCantusFirmusAnnotationFilter,
    ShowSicWarningsFilter,
    SicFilter,
    TransposeFilter,
    CustomFilter,
    HideBarlinesFilter,
    HideSpineDataFilter,
    ShowAllMeasureNumbersFilter,
    TieSplitFilter,
];

const filterOptions = allFilters.map(filter => {
    return {
        text: t(`humdrumFilter.${filter.NAME}`),
        value: filter.NAME,
        filter,
    };
});

function removeFilter(filterId) {
    emit('removeFilter', filterId);
}

function addFilter(filter) {
    emit('addFilter', filter);
    selectedFilter.value = null;
}

function findFilter(value) {
    return filterOptions.find(f => value === f.value);
}

function applyFilterWithConfig(args) {
    const item = findFilter(selectedFilter.value);
    try {
        addFilter(new item.filter(...(args || [])));
    } catch (e) {
        console.error(e.message);
    }
}

function applyFilter(event) {
    const item = findFilter(selectedFilter.value);
    try {
        const filter = new item.filter();
        if(!filter.configurable) {
            addFilter(filter);
        }
    } catch (e) {
        // console.error(e.message);
    }
}
</script>

<template>
    <div class="mt-4 flex flex-col gap-4">
        <div class="flex gap-4">
            <FormDropdown v-if="!expertMode" v-model="selectedFilter" :options="filterOptions" @update:modelValue="applyFilter" close-on-change />
            <div class="shrink-0 ml-auto justify-self-end">
                <Button size="md" @click="emit('update:expertMode', !expertMode)">
                    {{ expertMode ? $t('presetFilters') : $t('expertMode') }}
                </Button>
            </div>
        </div>
        <div v-if="selectedFilter">
            <Card>
                <HumdrumFilterConfigurator :filter="selectedFilter" @applyFilter="applyFilterWithConfig"></HumdrumFilterConfigurator>
            </Card>
        </div>
        <div v-if="filters.length && !expertMode" class="grow">
            <BadgeGroup>
                <Badge v-for="filter in filters" :key="filter.id" :removable="true" @remove="removeFilter(filter.id)">
                    {{ $t(`humdrumFilter.${filter.className }`) }}
                </Badge>
            </BadgeGroup>
        </div>
        <div v-if="expertMode">
            <MonacoEditor :modelValue="initialFilterString" @update:modelValue="emit('update:manualFilters', $event)" :grow-line-rows="true" />
        </div>
    </div>
</template>
