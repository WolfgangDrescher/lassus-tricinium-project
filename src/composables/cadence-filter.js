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
};

export const useCadenceFilterStore = defineStore('cadence_filter', {
    state: () => useLocalStorage('cadence_filter', {...defaultFilter}),
    actions: {
        update(prop, value) {
            this[prop] = value;
        },
        reset() {
            this.$patch({...defaultFilter});
        },
    },
});