<script setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import { Tricinium } from '../composables/useTricinium';
import TextDiff from './TextDiff.vue';
import { useDiffToGitDiff } from '../composables/useDiffToGitDiff.js'
import Dropdown from './Form/Dropdown.vue';

const props = defineProps({
    tricinium: {
        type: Tricinium,
        required: true,
    },
});

const diffOptions = reactive({
    outputFormat: 'side-by-side',
});

const selectedVoices = ref(['cantus', 'tenor', 'bassus']);

watchEffect(() => {
    const voicesOrdering = ['cantus', 'tenor', 'bassus'];
    selectedVoices.value.sort((a, b) => voicesOrdering.indexOf(a) - voicesOrdering.indexOf(b));
});

const voiceOptions = [
    {
        value: 'cantus',
        label: 'Cantus',
    },
    {
        value: 'tenor',
        label: 'Tenor',
    },
    {
        value: 'bassus',
        label: 'Bassus',
    },
];

const diff = computed(() => {
    return selectedVoices.value.map(voice => {
        const fileName = voice.charAt(0).toUpperCase() + voice.slice(1);
        const a = props.tricinium.lyricsAsString(false, '\n');
        const b = props.tricinium.getVoiceLyrics(voice);
        return useDiffToGitDiff(a, b, fileName);
    }).join('\n');
});
</script>

<template>
    <select v-model="diffOptions.outputFormat">
        <option value="line-by-line">Line by line</option>
        <option value="side-by-side">Side by side</option>
    </select>
    <Dropdown v-model="selectedVoices" :options="voiceOptions"/>
    <TextDiff :diff="diff" :options="diffOptions" />
</template>
