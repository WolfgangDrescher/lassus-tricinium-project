import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';


export const useFilterStore = defineStore('filter', () => {
    const filters = ref(useLocalStorage('vueUseFilter', {
        a: null,
        b: null,
        c: null,
    }));

    return {
        filters,
    };
});
