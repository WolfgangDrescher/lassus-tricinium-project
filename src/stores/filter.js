import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';


export const useFilterStore = defineStore('filter', {
    state: () => useLocalStorage('tricinium_filter', {
        composer: null,
        title: null,
        lyrics: null,
        nr: null,
        mode: null,
        transposed: null,
        finalis: null,
        clefs: null,
        searchText: null,
    }),
    actions: {
        updateFilter(prop, value) {
            this[prop] = value;
        },
    },
});
