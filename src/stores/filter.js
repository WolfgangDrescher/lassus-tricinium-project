import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const defaultFilter = {
    composer: null,
    title: null,
    lyrics: null,
    nr: null,
    mode: null,
    transposed: null,
    finalis: null,
    clefs: null,
    searchText: null,
};

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
        update(prop, value) {
            this[prop] = value;
        },
        reset() {
            this.$patch({...defaultFilter});
        },
    },
});
