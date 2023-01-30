<script setup>
import { storeToRefs } from 'pinia';

const { t } = useI18n();

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});

const store = useTriciniumViewOptionsStore();
const { showLyricsForVoices, lyricsDiffOutputFormat } = storeToRefs(store);

const diffOptions = computed(() => ({
    outputFormat: lyricsDiffOutputFormat.value,
}));

watchEffect(() => {
    const voicesOrdering = ['cantus', 'tenor', 'bassus'];
    showLyricsForVoices.value.sort((a, b) => voicesOrdering.indexOf(a) - voicesOrdering.indexOf(b));
});

const voiceOptions = [
    {
        value: 'cantus',
        text: t('voice.cantus'),
    },
    {
        value: 'tenor',
        text: t('voice.tenor'),
    },
    {
        value: 'bassus',
        text: t('voice.bassus'),
    },
];

const diffOutputFormatOptions = [
    {
        value: 'line-by-line',
        text: t('diffOutputFormat.lineByLine'),
    },
    {
        value: 'side-by-side',
        text: t('diffOutputFormat.sideBySide'),
    },
];

const diff = computed(() => {
    return showLyricsForVoices.value.map(voice => {
        const fileName = voice.charAt(0).toUpperCase() + voice.slice(1);
        const a = props.tricinium.lyricsAsString(false, '\n');
        const b = props.tricinium.getVoiceLyrics(voice);
        return useDiffToGitDiff(a, b, fileName);
    }).join('\n');
});
</script>

<template>
    <div class="grid grid-cols-2 gap-4 my-4">
        <FormDropdown v-model="showLyricsForVoices" :options="voiceOptions" :multiple="true" :search-enabled="false" />
        <FormDropdown v-model="lyricsDiffOutputFormat" :options="diffOutputFormatOptions" :search-enabled="false" :badge-show-remove-button="false" />
    </div>
    <TextDiff :diff="diff" :options="diffOptions" />
</template>
