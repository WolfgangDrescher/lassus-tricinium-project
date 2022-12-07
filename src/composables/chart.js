import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const defaultChartOptions = {
    dimension: null,
};

export const useChartStore = defineStore('chart', {
    state: () => ({...defaultChartOptions}),
    actions: {
        update(prop, value) {
            this[prop] = value;
        },
        reset() {
            this.$patch({...defaultChartOptions});
        },
    },
});
