<script setup>
import { ref } from 'vue';
import Button from './Button.vue';
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
})
const emit = defineEmits(['addFilter', 'removeFilter']);

const measureFilterValue = ref(null);
const extractFilterValue = ref(null);
const transposeValue = ref('');
const transposeMode = ref('-t');
const cintFilterInterval = ref(6);
const cintFilterDirection = ref(2);
const cintFilterColor = ref('#f97316');
const shedValue = ref(null);

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
]

const filterOptions = allFilters.map(filter => {
    return {
        label: filter.name,
        value: filter.name,
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
    const item = filterOptions.find(f => selectedFilter.value === f.value)
    console.log(item);
    try {
        addFilter(new item.filter(...(args || [])));
    } catch (e) {
        console.error(e.message);
    }
}
</script>

<template>

    <div class="grid grid-cols-2 gap-4 my-4">
        <Dropdown v-model="selectedFilter" :options="filterOptions" />
        <HumdrumFilterConfigurator :filter="selectedFilter" @applyFilter="applyFilter"></HumdrumFilterConfigurator>
    </div>
    <div class="my-4 w-full border-t-4 border-gray-300"></div>
    <Button @click="addFilter(new ClefFilter())">Modern clefs</Button>
    <Button @click="addFilter(new MensuralFilter())">Mensural</Button>
    <Button @click="addFilter(new LyricsFilter())">Remove lyrics</Button>
    <Button @click="addFilter(new EditorialAccidentalsFilter())">Remove editorial accidentals</Button>
    <Button @click="addFilter(new CompositeRhythmFilter())">Composite rhythm</Button>
    <Button @click="addFilter(new DissonantFilter())">Dissonant</Button>
    <Button @click="addFilter(new AutobeamFilter())">Autobeam</Button>
    <Button @click="addFilter(new ImitationFilter())">Imitation</Button>
    <Button @click="addFilter(new MelismaFilter())">Melisma</Button>
    <Button @click="addFilter(new SicFilter())">Sic</Button>
    <input v-model="transposeMode" />
    <input v-model="transposeValue" />
    <Button @click="addFilter(new TransposeFilter(transposeMode, transposeValue))">Transpose</Button>
    <input v-model="measureFilterValue" />
    <Button @click="addFilter(new MeasureFilter(measureFilterValue))">Measure</Button>
    <input v-model="extractFilterValue" />
    <Button @click="addFilter(new ExtractFilter(extractFilterValue))">Extract</Button>
    <input v-model="cintFilterInterval" />
    <input v-model="cintFilterDirection" />
    <input v-model="cintFilterColor" />
    <Button @click="addFilter(new ParallelIntervalsFilter(cintFilterInterval, cintFilterDirection, cintFilterColor))">Parallel intervals</Button>
    <input v-model="shedValue" />
    <Button @click="addFilter(new ShedFilter(shedValue))">Shed</Button>
    <div class="my-4 w-full border-t-4 border-gray-300"></div>
    <BadgeGroup>
        <Badge v-for="filter in filters" :key="filter.id">
            {{ filter.className }}
            <button @click="removeFilter(filter.id)">remove</button>    
        </Badge>
    </BadgeGroup>
</template>
