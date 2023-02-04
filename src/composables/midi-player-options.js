import { defineStore } from 'pinia';

const defaultFilter = {
    instrumentName: 'marimba',
};

export const useMidiPlayerStore = defineStore('midi_player_store', {
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
