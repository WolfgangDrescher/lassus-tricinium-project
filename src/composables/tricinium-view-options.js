import { defineStore } from 'pinia';

const defaultFilter = {
    viewMode: 'score',
    scoreDisplay: 'lassus',
    showLyrics: true,
    showSidebar: true,
    splitViewWidth: 50,
};

export const useTriciniumViewOptionsStore = defineStore('tricinium_view_options', {
    state: () => ({...defaultFilter}),
});
