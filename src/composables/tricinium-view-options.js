import { defineStore } from 'pinia';

const defaultFilter = {
    viewMode: 'score',
    scoreDisplay: 'lassus',
    showLyrics: true,
    showScore: true,
    showSidebar: true,
    splitViewWidth: 50,
    showLyricsForVoices: ['cantus', 'tenor', 'bassus'],
    lyricsDiffOutputFormat: 'side-by-side',
    triciniumScoreFilters: [],
    triciniumScoreManualFilters: '',
    triciniumExpertMode: false,
    ulenbergScoreFilters: [],
    ulenbergScoreManualFilters: '',
    ulenbergExpertMode: false,
};

export const useTriciniumViewOptionsStore = defineStore('tricinium_view_options', {
    state: () => ({...defaultFilter}),
});
