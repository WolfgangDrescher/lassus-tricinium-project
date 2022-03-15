<script setup>
import { watch, ref } from 'vue';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import { useDeferred } from '../composables/useDeferred';
// import Loading from 'vue-verovio-canvas/src/components/Loading.vue';
import Button from '../components/Button.vue';
import ButtonGroup from './ButtonGroup.vue';

const props = defineProps({
    url: String,
});

const midiPlayerIsReady = useDeferred();
const soundFrontIsReady = useDeferred();
const isReady = useDeferred();
const isLoading = ref(true);
const ac = new AudioContext;
const instrument = ref(null);
const midiPlayer = new MidiPlayer.Player();


Promise.all([midiPlayerIsReady.promise, soundFrontIsReady.promise]).then(() => {
    isReady.resolve();
    isLoading.value = false;
});


watch(() => props.url, (value) => {
    midiPlayer.loadDataUri(value);
});

if(props.url) {
    midiPlayer.loadDataUri(props.url);
}

midiPlayer.on('playing', ({ tick }) => {
    if (tick <= midiPlayer.totalTicks) {
        // currentTick.set(tick);
    }
});

midiPlayer.on('midiEvent', ({name, velocity, noteNumber, ...event}) => {
    if (name === 'Note on') {
        if (velocity === 0) {
            // TODO stop note
        } else {
            instrument.value.play(noteNumber, 0);
        }
    }
});

midiPlayer.on('endOfFile', () => {
    pause();
});

midiPlayer.on('fileLoaded', () => {
    midiPlayerIsReady.resolve();
});

async function play() {
    await isReady.promise;
    midiPlayer.play();
}

async function stop() {
    await isReady.promise;
    midiPlayer.stop();
}

async function pause() {
    await isReady.promise;
    midiPlayer.pause();
}


// marimba acoustic_grand_piano trumpet
Soundfont.instrument(ac, 'marimba').then(value => {
    instrument.value = value;
    soundFrontIsReady.resolve();
});

</script>

<template>
    <!-- <Loading v-if="isLoading" /> -->
    <template v-if="!isLoading">
        <ButtonGroup>
            <Button @click="play">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </Button>
            <Button @click="stop">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            </Button>
            <Button @click="pause">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </Button>
        </ButtonGroup>
    </template>
</template>
