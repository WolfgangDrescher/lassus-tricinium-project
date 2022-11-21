import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const defaultFilter = {
    composers: [],
    title: null,
    lyrics: null,
    nr: null,
    modes: [],
    transposition: null,
    finalis: [],
    clefs: [],
    cantusFirmus: [],
    searchText: null,
};

export const useFilterStore = defineStore('filter', {
    state: () => useLocalStorage('tricinium_filter', {...defaultFilter}),
    actions: {
        update(prop, value) {
            this[prop] = value;
        },
        reset() {
            this.$patch({...defaultFilter});
        },
    },
});
