<script setup>
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

const props = defineProps({
    url: String,
});

const midiPlayerIsReady = useDeferred();
const soundFrontIsReady = useDeferred();
const isReady = useDeferred();
const isLoading = ref(true);
const ac = new AudioContext();
const instrument = ref(null);
const midiPlayer = new MidiPlayer.Player();

Promise.all([midiPlayerIsReady.promise, soundFrontIsReady.promise]).then(() => {
    isReady.resolve();
    isLoading.value = false;
});

watch(() => props.url, (value) => {
    midiPlayer.loadDataUri(value);
});

if (props.url) {
    midiPlayer.loadDataUri(props.url);
}

midiPlayer.on('playing', ({ tick }) => {
    if (tick <= midiPlayer.totalTicks) {
        // currentTick.set(tick);
    }
});

midiPlayer.on('midiEvent', ({ name, velocity, noteNumber, ...event }) => {
    if (name === 'Note on') {
        if (velocity === 0) {
            // TODO stop note
        } else {
            instrument.value.play(noteNumber, 0);
        }
    }
});

midiPlayer.on('endOfFile', () => {
    stop();
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
    <div v-if="!isLoading">
        <ButtonGroup>
            <Button @click="play">
                <Icon name="heroicons-solid:play" />
            </Button>
            <Button @click="stop">
                <Icon name="heroicons-solid:stop" />
            </Button>
            <Button @click="pause">
                <Icon name="heroicons-solid:pause" />
            </Button>
        </ButtonGroup>
    </div>
</template>
