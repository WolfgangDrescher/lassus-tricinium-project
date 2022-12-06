import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const defaultFilter = {
    composer: null,
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

export const useTriciniumFilterStore = defineStore('tricinium_filter', {
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
