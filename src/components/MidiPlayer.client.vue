<script setup>
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import { storeToRefs } from 'pinia';

const props = defineProps({
    url: String,
});

defineExpose({
    skipToSeconds,
});

function skipToSeconds(seconds) {
    if (!isLoading.value) {
        midiPlayer.skipToSeconds(seconds);
        play();
    }
}

const midiPlayerIsReady = useDeferred();
const soundFrontIsReady = useDeferred();
const isReady = useDeferred();
const isLoading = ref(true);
const ac = new AudioContext();
const instrument = ref(null);
const midiPlayer = new MidiPlayer.Player();
const isPlaying = ref(false);
const { instrumentName } = storeToRefs(useMidiPlayerStore());

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

watch(instrumentName, (value) => {
    loadInstrument(value);
});

function loadInstrument(name) {
    // marimba acoustic_grand_piano trumpet voice_oohs
    Soundfont.instrument(ac, name).then(value => {
        instrument.value = value;
        soundFrontIsReady.resolve();
    });
}

loadInstrument(instrumentName.value);

onUnmounted(async () => {
    await stop();
});

const instruments = [
    "accordion",
    "acoustic_bass",
    "acoustic_grand_piano",
    "acoustic_guitar_nylon",
    "agogo",
    "banjo",
    "bassoon",
    "blown_bottle",
    "breath_noise",
    "celesta",
    "choir_aahs",
    "church_organ",
    "clarinet",
    "clavinet",
    "drawbar_organ",
    "dulcimer",
    "electric_bass_pick",
    "electric_piano_1",
    "flute",
    "glockenspiel",
    "harmonica",
    "harpsichord",
    "kalimba",
    "marimba",
    "oboe",
    "orchestral_harp",
    "pizzicato_strings",
    "recorder",
    "string_ensemble_1",
    "synth_bass_2",
    "synth_brass_1",
    "synth_brass_2",
    "tango_accordion",
    "tenor_sax",
    "tinkle_bell",
    "trombone",
    "tuba",
    "vibraphone",
    "voice_oohs",
].map(instrument => ({ value: instrument, text: instrument }));
</script>

<template>
    <!-- <Loading v-if="isLoading" /> -->
    <div v-if="!isLoading" class="flex gap-4">
        <div>
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
        <div class="w-52">
            <FormDropdown v-model="instrumentName" :options="instruments" :multiple="false" />
        </div>
    </div>
</template>
