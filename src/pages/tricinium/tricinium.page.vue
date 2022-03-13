<script setup>
import Heading from '../../components/Heading.vue';
import AsyncVerovioCanvas from '../../components/AsyncVerovioCanvas.vue';
import { useTricinium } from '../../composables/useTricinium';
import TriciniumTextDiff from '../../components/TriciniumTextDiff.vue';

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});
const tricinium = useTricinium(props.tricinium);
</script>

<template>
    <Heading>Tricinium</Heading>
    <TriciniumTextDiff :tricinium="tricinium" />
    <pre v-text="tricinium"></pre>
    <AsyncVerovioCanvas :url="tricinium.rawFile" :options="{spacingSystem: 25}" />
</template>
