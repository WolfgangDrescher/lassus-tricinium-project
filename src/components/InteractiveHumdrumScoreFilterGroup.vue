<script setup>
import { ref } from 'vue';
import {
    ClefFilter,
    MensuralFilter,
    LyricsFilter,
    EditorialAccidentalsFilter,
    CompositeRhythmFilter,
    MeasureFilter,
    ExtractFilter,
    ParallelIntervalsFilter,
    DissonantFilter,
    AutobeamFilter,
    ImitationFilter,
    MelismaFilter,
    ShedFilter,
    SicFilter,
    TransposeFilter,
} from '../classes/HumdrumFilters.js';
import BadgeGroup from './BadgeGroup.vue';
import Badge from './Badge.vue';
import Dropdown from './Form/Dropdown.vue';
import HumdrumFilterConfigurator from './HumdrumFilterConfigurator.vue';

defineProps({
    filters: Array,
});
const emit = defineEmits(['addFilter', 'removeFilter']);

const selectedFilter = ref(null);

const allFilters = [
    ClefFilter,
    MensuralFilter,
    LyricsFilter,
    EditorialAccidentalsFilter,
    CompositeRhythmFilter,
    MeasureFilter,
    ExtractFilter,
    ParallelIntervalsFilter,
    DissonantFilter,
    AutobeamFilter,
    ImitationFilter,
    MelismaFilter,
    ShedFilter,
    SicFilter,
    TransposeFilter,
];

const filterOptions = allFilters.map(filter => {
    return {
        text: filter.NAME,
        value: filter.NAME,
        filter,
    };
});

function removeFilter(filterId) {
    emit('removeFilter', filterId);
}

function addFilter(filter) {
    emit('addFilter', filter);
}

function applyFilter(args) {
    const item = filterOptions.find(f => selectedFilter.value === f.value);
    try {
        addFilter(new item.filter(...(args || [])));
    } catch (e) {
        console.error(e.message);
    }
}
</script>

<template>
    <div class="grid grid-cols-4 gap-4 my-4">
        <Dropdown v-model="selectedFilter" :options="filterOptions" />
        <div class="col-span-3">
            <HumdrumFilterConfigurator :filter="selectedFilter" @applyFilter="applyFilter"></HumdrumFilterConfigurator>
        </div>
    </div>

    <BadgeGroup>
        <Badge v-for="filter in filters" :key="filter.id" :removable="true" @remove="removeFilter(filter.id)">
            {{ filter.className }}
        </Badge>
    </BadgeGroup>
</template>
