<script setup>
const { t } = useI18n();

const props = defineProps({
    tricinium: {
        type: Object,
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
        <FormDropdown v-model="selectedVoices" :options="voiceOptions" :multiple="true" :search-enabled="false" />
        <FormDropdown v-model="diffOptions.outputFormat" :options="diffOutputFormatOptions" :search-enabled="false" :badge-show-remove-button="false" />
    </div>
    <TextDiff :diff="diff" :options="diffOptions" />
</template>
