import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const defaultFilter = {
    composer: null,
    title: null,
    lyrics: null,
    nr: null,
    finalis: [],
    searchText: null,
    degrees: [],
    ultimas: [],
    startLine: null,
    bassusClausulae: [],
    tenorClausulae: [],
    cantusClausulae: [],
    weirdnessFactorRange: [0, 1],
};

export const useCadenceFilterStore = defineStore('cadence_filter', {
    state: () => ({...defaultFilter}),
    actions: {
        update(prop, value) {
            this[prop] = value;
        },
        reset() {
            this.$patch({...defaultFilter});
        },
    },
});
