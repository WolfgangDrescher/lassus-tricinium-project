<script setup>
import 'vue-verovio-canvas/style.css';
import { VerovioCanvas, createWorkerVerovioToolkit } from 'vue-verovio-canvas';

const { verovioWorker } = useVerovioWorker();
const toolkit = ref();
const verovioCanvas = ref();

const emit = defineEmits(['scoreIsReady']);

function loadToolkit() {
    toolkit.value = createWorkerVerovioToolkit(verovioWorker);
}

function unloadToolkit() {
    if (toolkit.value) {
        toolkit.value.removeToolkit();
        toolkit.value = null;
    }
}

function scoreIsReady(event) {
    emit('scoreIsReady', event);
}
</script>

<template>
    <VerovioCanvas ref="verovioCanvas" lazy :toolkit="toolkit" @load="loadToolkit" @unload="unloadToolkit" @score-is-ready="scoreIsReady" />
</template>
