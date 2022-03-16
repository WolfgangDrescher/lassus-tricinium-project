<script setup>
import { ref } from 'vue';
import Button from './Button.vue';
import {
    HumdrumClefFilter,
    HumdrumMensuralFilter,
    HumdrumLyricsFilter,
    HumdrumEditorialAccidentalsFilter,
    HumdrumCompositeRhythmFilter,
    HumdrumMeasureFilter,
    HumdrumExtractFilter,
    HumdrumParallelIntervalsFilter,
} from '../classes/HumdrumFilters.js';
import BadgeGroup from './BadgeGroup.vue';
import Badge from './Badge.vue';

defineProps({
    filters: Array,
})
const emit = defineEmits(['addFilter', 'removeFilter']);

const measureFilterValue = ref(null);
const extractFilterValue = ref(null);
const cintFilterInterval = ref(6);
const cintFilterDirection = ref(2);
const cintFilterColor = ref('#f97316');

function removeFilter(filterId) {
    emit('removeFilter', filterId);
}

function addFilter(filter) {
    emit('addFilter', filter);
}
</script>

<template>
    <Button @click="addFilter(new HumdrumClefFilter())">Modern clefs</Button>
    <Button @click="addFilter(new HumdrumMensuralFilter())">Mensural</Button>
    <Button @click="addFilter(new HumdrumLyricsFilter())">Remove lyrics</Button>
    <Button @click="addFilter(new HumdrumEditorialAccidentalsFilter())">Remove editorial accidentals</Button>
    <Button @click="addFilter(new HumdrumCompositeRhythmFilter())">Composite rhythm</Button>
    <input v-model="measureFilterValue" />
    <Button @click="addFilter(new HumdrumMeasureFilter(measureFilterValue))">Measure filter</Button>
    <input v-model="extractFilterValue" />
    <Button @click="addFilter(new HumdrumExtractFilter(extractFilterValue))">Extract filter</Button>
    <input v-model="cintFilterInterval" />
    <input v-model="cintFilterDirection" />
    <input v-model="cintFilterColor" />
    <Button @click="addFilter(new HumdrumParallelIntervalsFilter(cintFilterInterval, cintFilterDirection, cintFilterColor))">Extract filter</Button>
    <div class="my-4 w-full border-t-4 border-gray-300"></div>
    <BadgeGroup>
        <Badge v-for="filter in filters" :key="filter.id">
            {{ filter.className }}
            <button @click="removeFilter(filter.id)">remove</button>    
        </Badge>
    </BadgeGroup>
</template>
