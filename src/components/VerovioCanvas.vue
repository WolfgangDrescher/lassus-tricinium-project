<script setup>
import 'vue-verovio-canvas/style.css'
import { VerovioCanvas, createWorkerVerovioToolkit } from 'vue-verovio-canvas';
import createVerovioWorker from '../workers/verovio.js?worker';

const toolkit = createWorkerVerovioToolkit(createVerovioWorker())
const verovioCanvas = ref();

defineExpose({
    verovioCanvas,
});
</script>

<template>
    <VerovioCanvas ref="verovioCanvas" v-bind="{ ...$attrs, ...$props }" :toolkit="toolkit" />
</template>
