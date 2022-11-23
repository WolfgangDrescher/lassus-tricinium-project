<script setup>
import VerovioCanvasComponent from 'vue-verovio-canvas';
</script>

<template>
    <VerovioCanvasComponent v-bind="{ ...$attrs, ...$props }"></VerovioCanvasComponent>
</template>
