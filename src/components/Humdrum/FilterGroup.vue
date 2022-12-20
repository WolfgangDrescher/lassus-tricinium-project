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
    ShowSicWarningsFilter,
    SicFilter,
    TransposeFilter,
    CustomFilter,
} from '../../classes/HumdrumFilters.js';

defineProps({
    filters: Array,
});
const emit = defineEmits(['addFilter', 'removeFilter']);

const { t } = useI18n();

const selectedFilter = ref(null);

const allFilters = [
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
    ShowSicWarningsFilter,
    SicFilter,
    TransposeFilter,
    CustomFilter,
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
    <div>
        <div class="my-4">
            <FormDropdown v-model="selectedFilter" :options="filterOptions" @update:modelValue="applyFilter" close-on-change />
        </div>
        <div class="my-4" v-if="selectedFilter">
            <HumdrumFilterConfigurator :filter="selectedFilter" @applyFilter="applyFilterWithConfig"></HumdrumFilterConfigurator>
        </div>
    </div>
    <div class="mt-4" v-if="filters.length">
        <BadgeGroup>
            <Badge v-for="filter in filters" :key="filter.id" :removable="true" @remove="removeFilter(filter.id)">
                {{ $t(`humdrumFilter.${filter.className}`) }}
            </Badge>
        </BadgeGroup>
    </div>
</template>
