<script setup>
import { computed, reactive, toRef } from 'vue';
import { Tricinium } from '../composables/useTricinium';
import TextDiff from './TextDiff.vue';
import { useDiffToGitDiff } from '../composables/useDiffToGitDiff.js'

const props = defineProps({
    tricinium: {
        type: Tricinium,
        required: true,
    },
});

const options = reactive({
    outputFormat: 'side-by-side',
});

const activeVoices = reactive({
    cantus: true,
    tenor: true,
    bassus: true,
});

function getActiveVoices() {
    return Object.entries(activeVoices).reduce((previousValue, [key, value]) => {
        if(value) {
            previousValue.push(key);
        }
        return previousValue;
    }, []);
}

const diff = computed(() => {
    return getActiveVoices().map(voice => {
        const fileName = voice.charAt(0).toUpperCase() + voice.slice(1);
        const a = props.tricinium.lyricsAsString(false, '\n');
        const b = props.tricinium.getVoiceLyrics(voice);
        return useDiffToGitDiff(a, b, fileName);
    }).join('\n');
});
</script>

<template>
    <label>
        <input type="checkbox" v-model="activeVoices.cantus"> Cantus
    </label>
    <label>
        <input type="checkbox" v-model="activeVoices.tenor"> Tenor
    </label>
    <label>
        <input type="checkbox" v-model="activeVoices.bassus"> Bassus
    </label>
    <select v-model="options.outputFormat">
        <option value="line-by-line">Line by line</option>
        <option value="side-by-side">Side by side</option>
    </select>
    <TextDiff :diff="diff" :options="options" />
</template>
