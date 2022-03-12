<script setup>
import Heading from '../../components/Heading.vue';

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <Heading>Tricinium</Heading>
</template>
