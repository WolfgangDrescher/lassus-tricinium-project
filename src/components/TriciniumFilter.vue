<script setup>
import ClientOnly from './ClientOnly.js';
import InputField from './Form/InputField.vue';
import Dropdown from './Form/Dropdown.vue';
import { useFilterStore } from '../stores/filter';
import Button from './Button.vue';

const filter = useFilterStore();

function updateStore(prop, value) {
    filter.update(prop, value);
}

function resetFilter() {
    filter.reset();
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
    <ClientOnly>
        <div class="grid grid-cols-filter gap-4">
            <InputField v-model="filter.searchText" :modelvalue="filter.searchText" @updatemodelValue="updateStore('searchText', $event)" label="Search text" placeholder="Title, number, lyrics…" />
            <Dropdown v-model="filter.composer" :modelvalue="filter.composer" @updatemodelValue="updateStore('composer', $event)" label="Composer" :options="composerOptions" />
            <Dropdown v-model="filter.mode" :modelvalue="filter.mode" @updatemodelValue="updateStore('mode', $event)" label="Mode" :options="modeOptions" />
            <Dropdown v-model="filter.transposed" :modelvalue="filter.transposed" @updatemodelValue="updateStore('transposed', $event)" label="Transposed" :options="transposedOptions" />
            <Dropdown v-model="filter.finalis" :modelvalue="filter.finalis" @updatemodelValue="updateStore('finalis', $event)" label="Finalis" :options="finalisOptions" />
            <Button @click="resetFilter">Reset</Button>
        </div>
    </ClientOnly>
</template>
