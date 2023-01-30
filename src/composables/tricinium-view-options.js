import { defineStore } from 'pinia';

const defaultFilter = {
    viewMode: 'score',
    scoreDisplay: 'lassus',
    showLyrics: true,
    showSidebar: true,
    showModernClefs: true,
    splitViewWidth: 50,
};

export const useTriciniumViewOptionsStore = defineStore('tricinium_view_options', {
    state: () => ({...defaultFilter}),
});
