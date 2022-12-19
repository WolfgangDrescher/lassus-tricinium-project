import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const defaultOptions = {
    dimension: null,
};

export const useStatsDimensionStore = defineStore('stats_dimension', {
    state: () => ({...defaultOptions}),
    actions: {
        update(prop, value) {
            this[prop] = value;
        },
        reset() {
            this.$patch({...defaultOptions});
        },
    },
});
