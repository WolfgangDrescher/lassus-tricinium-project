<script setup>
import 'vue-verovio-canvas/style.css';
import { VerovioCanvas, createWorkerVerovioToolkit } from 'vue-verovio-canvas';

const { verovioWorker } = useVerovioWorker();
const toolkit = createWorkerVerovioToolkit(verovioWorker);
const verovioCanvas = ref();

const emit = defineEmits(['mounted']);

onMounted(() => {
    nextTick(() => {
        emit('mounted', verovioCanvas.value);
    });
});
</script>

<template>
    <VerovioCanvas ref="verovioCanvas" :toolkit="toolkit" />
</template>
