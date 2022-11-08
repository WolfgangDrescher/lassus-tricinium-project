import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const defaultChartOptions = {
    dimension: null,
};

export const useChartStore = defineStore('chart', {
    state: () => useLocalStorage('chart_options', {...defaultChartOptions}),
    actions: {
        update(prop, value) {
            this[prop] = value;
        },
        reset() {
            this.$patch({...defaultChartOptions});
        },
    },
});
