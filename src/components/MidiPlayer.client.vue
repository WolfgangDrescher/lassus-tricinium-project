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
const isPlaying = ref(false);

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

const activeKeys = {};

midiPlayer.on('midiEvent', ({ name, velocity, noteNumber }) => {
    if (name === 'Note on') {
        if (velocity === 0) {
            instrument.value.stop(ac.currentTime, [activeKeys[noteNumber]]);
        } else {
            activeKeys[noteNumber] = instrument.value.play(noteNumber).id;
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
    isPlaying.value = true;
}

async function stop() {
    await isReady.promise;
    midiPlayer.stop();
    isPlaying.value = false;
}

async function pause() {
    await isReady.promise;
    midiPlayer.pause();
    isPlaying.value = false;
}

async function toggle() {
    if (isPlaying.value) {
        pause();
    } else {
        play();
    }
}

// marimba acoustic_grand_piano trumpet
Soundfont.instrument(ac, 'marimba').then(value => {
    instrument.value = value;
    soundFrontIsReady.resolve();
});

onUnmounted(async () => {
    await stop();
});
</script>

<template>
    <!-- <Loading v-if="isLoading" /> -->
    <div v-if="!isLoading">
        <ButtonGroup>
            <Button @click="toggle" outline>
                <Icon v-if="isPlaying" name="heroicons-solid:pause" size="1.25rem" />
                <Icon v-else name="heroicons-solid:play" size="1.25rem" />
            </Button>
            <Button v-if="isPlaying" @click="stop" outline>
                <Icon name="heroicons-solid:stop" size="1.25rem" />
            </Button>
        </ButtonGroup>
    </div>
</template>
