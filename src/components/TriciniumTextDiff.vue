<script setup>
import { Tricinium } from '../composables/useTricinium';

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
        text: 'Cantus',
    },
    {
        value: 'tenor',
        text: 'Tenor',
    },
    {
        value: 'bassus',
        text: 'Bassus',
    },
];

const diffOutputFormatOptions = [
    {
        value: 'line-by-line',
        text: 'Line by line',
    },
    {
        value: 'side-by-side',
        text: 'Side by side',
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
    <div class="grid grid-cols-2 gap-4 my-4">
        <FormDropdown v-model="selectedVoices" :options="voiceOptions" :multiple="true" />
        <FormDropdown v-model="diffOptions.outputFormat" :options="diffOutputFormatOptions" :badge-show-remove-button="false" />
    </div>
    <TextDiff :diff="diff" :options="diffOptions" />
</template>
