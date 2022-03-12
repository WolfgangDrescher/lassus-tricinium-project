<script setup>
import { toRefs } from 'vue';
import Heading from '../../components/Heading.vue';
import AsyncVerovioCanvas from '../../components/AsyncVerovioCanvas.vue';

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});

const { tricinium } = toRefs(props);
</script>

<template>
    <Heading>Tricinium</Heading>
    <pre v-text="tricinium"></pre>
    <AsyncVerovioCanvas :url="tricinium.rawFile" :options="{spacingSystem: 25}" />
</template>
