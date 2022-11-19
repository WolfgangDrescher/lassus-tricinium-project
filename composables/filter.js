import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const defaultFilter = {
    composer: null,
    title: null,
    lyrics: null,
    nr: null,
    mode: null,
    transposition: null,
    finalis: null,
    clefs: null,
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
