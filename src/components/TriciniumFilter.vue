<script setup>
import InputField from './Form/InputField.vue';
import Dropdown from './Form/Dropdown.vue';
import { useFilterStore } from '../stores/filter';
import Button from './Button.vue';

const filter = useFilterStore();

function updateStore(prop, value) {
    filter.updateFilter(prop, value);
}

function resetFilter() {
    filter.$reset();
    console.log('resetFilter');
}

const composerOptions = [
    {
        value: 'Orlandus Lassus',
        text: 'Orlandus Lassus',
    },
    {
        value: 'Rudolphus Lassus',
        text: 'Rudolphus Lassus',
    },
];

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
];

const transposedOptions = [
    {
        value: 'true',
        text: 'true',
    },
    {
        value: 'false',
        text: 'false',
    },
];

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
    <div class="grid grid-cols-filter gap-4">
        <InputField :model-value="filter.searchText" @update:modelValue="updateStore('searchText', $event)" label="Search text" placeholder="Title, number, lyrics…" />
        <Dropdown :model-value="filter.composer" @update:modelValue="updateStore('composer', $event)" label="Composer" :options="composerOptions" />
        <Dropdown :model-value="filter.mode" @update:modelValue="updateStore('mode', $event)" label="Mode" :options="modeOptions" />
        <Dropdown :model-value="filter.transposed" @update:modelValue="updateStore('transposed', $event)" label="Transposed" :options="transposedOptions" />
        <Dropdown :model-value="filter.finalis" @update:modelValue="updateStore('finalis', $event)" label="Finalis" :options="finalisOptions" />
        <Button @click="resetFilter">Reset</Button>
    </div>
</template>
