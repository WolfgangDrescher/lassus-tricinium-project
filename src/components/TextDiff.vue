<script setup>
import * as Diff2html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

const defaultOptions = {
    drawFileList: false,
    outputFormat: 'side-by-side',
};

const props = defineProps({
    diff: {
        type: String,
        required: true,
    },
    options: {
        type: Object,
        default: () => ({}),
    },
});

const diffHtml = computed(() => {
    return Diff2html.html(Diff2html.parse(props.diff), Object.assign({}, defaultOptions, props.options));
});
</script>

<template>
    <div v-html="diffHtml"></div>
</template>
