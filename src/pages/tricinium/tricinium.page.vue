<script setup>
import { toRefs } from 'vue';
import Heading from '../../components/Heading.vue';

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
</template>
