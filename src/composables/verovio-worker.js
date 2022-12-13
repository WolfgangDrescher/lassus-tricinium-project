import { defineStore } from 'pinia';
import createVerovioWorker from '../workers/verovio.js?worker';

export const useVerovioWorker = defineStore('verovio_worker', {
    state: () => {
        return {
            verovioWorker: createVerovioWorker(),
        };
    },
});
