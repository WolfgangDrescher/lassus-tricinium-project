<script setup>
import InputField from './Form/InputField.vue';
import Dropdown from './Form/Dropdown.vue';

defineProps({
    filter: {
        type: Object,
        required: true,
    },
});

const composerOptions = [
    {
        value: 'Orlandus Lassus',
        text: 'Orlandus Lassus',
    },
    {
        value: 'Rudolphus Lassus',
        text: 'Rudolphus Lassus',
    },
]

const modeOptions = [
    {
        value: 'ionian',
        text: 'Ionian',
    },
    {
        value: 'dorian',
        text: 'Dorian',
    },
    {
        value: 'phrygian',
        text: 'Phrygian',
    },
    {
        value: 'lydian',
        text: 'Lydian',
    },
    {
        value: 'mixolydian',
        text: 'Mixolydian',
    },
    {
        value: 'aeolian',
        text: 'Aeolian',
    },
    {
        value: 'locrian',
        text: 'Locrian',
    },
]

const transposedOptions = [
    {
        value: 'true',
        text: 'true',
    },
    {
        value: 'false',
        text: 'false',
    },
]

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
]
</script>

<template>
    <div class="grid grid-cols-filter gap-4">
        <InputField v-model="filter.searchText" label="Search text" placeholder="Search in title, number and lyrics…" />
        <Dropdown v-model="filter.composer" label="Composer" :options="composerOptions" />
        <Dropdown v-model="filter.mode" label="Mode" :options="modeOptions" />
        <Dropdown v-model="filter.transposed" label="Transposed" :options="transposedOptions" />
        <Dropdown v-model="filter.finalis" label="Finalis" :options="finalisOptions" />
    </div>
</template>
