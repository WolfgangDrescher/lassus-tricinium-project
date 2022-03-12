<script setup>
import { defineAsyncComponent } from 'vue';
// import 'vue-verovio-canvas/dist/style.css';
const AsyncVerovioCanvas = defineAsyncComponent(() => import('vue-verovio-canvas'));
</script>

<template>
    <component :is="AsyncVerovioCanvas" v-bind="{...$attrs, ...$props}"></component>
</template>
