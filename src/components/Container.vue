<script setup>
defineProps({
    fluid: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div :class="{ 'mx-auto px-2 md:px-4': fluid, container: !fluid }">
        <slot></slot>
    </div>
</template>
