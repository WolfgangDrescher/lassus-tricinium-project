import { defineStore } from 'pinia';

const defaultFilter = {
    showModernClefs: true,
    showIntervallsatz: true,
    hideLyrics: true,
};

export const useCadenceHumdrumFiltersStore = defineStore('cadence_humdrum_filters', {
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
