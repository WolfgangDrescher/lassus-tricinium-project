import { defineStore } from 'pinia';

let verovioWorker;

if (import.meta.env.PROD) {
    verovioWorker = new Worker(new URL('../workers/verovio.js', import.meta.url), { type: 'classic'});
} else {
    verovioWorker = new Worker(new URL('../workers/verovio-dev.js', import.meta.url), { type: 'module'});
}

export const useVerovioWorker = defineStore('verovio_worker', {
    state: () => {
        return {
            verovioWorker,
        };
    },
});
