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
    "acoustic_guitar_steel",
    "agogo",
    "alto_sax",
    "applause",
    "bagpipe",
    "banjo",
    "baritone_sax",
    "bassoon",
    "bird_tweet",
    "blown_bottle",
    "brass_section",
    "breath_noise",
    "bright_acoustic_piano",
    "celesta",
    "cello",
    "choir_aahs",
    "church_organ",
    "clarinet",
    "clavinet",
    "contrabass",
    "distortion_guitar",
    "drawbar_organ",
    "dulcimer",
    "electric_bass_finger",
    "electric_bass_pick",
    "electric_grand_piano",
    "electric_guitar_clean",
    "electric_guitar_jazz",
    "electric_guitar_muted",
    "electric_piano_1",
    "electric_piano_2",
    "english_horn",
    "fiddle",
    "flute",
    "french_horn",
    "fretless_bass",
    "fx_1_rain",
    "fx_2_soundtrack",
    "fx_3_crystal",
    "fx_4_atmosphere",
    "fx_5_brightness",
    "fx_6_goblins",
    "fx_7_echoes",
    "fx_8_scifi",
    "glockenspiel",
    "guitar_fret_noise",
    "guitar_harmonics",
    "gunshot",
    "harmonica",
    "harpsichord",
    "helicopter",
    "honkytonk_piano",
    "kalimba",
    "koto",
    "lead_1_square",
    "lead_2_sawtooth",
    "lead_3_calliope",
    "lead_4_chiff",
    "lead_5_charang",
    "lead_6_voice",
    "lead_7_fifths",
    "lead_8_bass__lead",
    "marimba",
    "melodic_tom",
    "music_box",
    "muted_trumpet",
    "oboe",
    "ocarina",
    "orchestra_hit",
    "orchestral_harp",
    "overdriven_guitar",
    "pad_1_new_age",
    "pad_2_warm",
    "pad_3_polysynth",
    "pad_4_choir",
    "pad_5_bowed",
    "pad_6_metallic",
    "pad_7_halo",
    "pad_8_sweep",
    "pan_flute",
    "percussive_organ",
    "piccolo",
    "pizzicato_strings",
    "recorder",
    "reed_organ",
    "reverse_cymbal",
    "rock_organ",
    "seashore",
    "shakuhachi",
    "shamisen",
    "shanai",
    "sitar",
    "slap_bass_1",
    "slap_bass_2",
    "soprano_sax",
    "steel_drums",
    "string_ensemble_1",
    "string_ensemble_2",
    "synth_bass_1",
    "synth_bass_2",
    "synth_brass_1",
    "synth_brass_2",
    "synth_choir",
    "synth_drum",
    "synth_strings_1",
    "synth_strings_2",
    "taiko_drum",
    "tango_accordion",
    "telephone_ring",
    "tenor_sax",
    "timpani",
    "tinkle_bell",
    "tremolo_strings",
    "trombone",
    "trumpet",
    "tuba",
    "tubular_bells",
    "vibraphone",
    "viola",
    "violin",
    "voice_oohs",
    "whistle",
    "woodblock",
    "xylophone"
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
