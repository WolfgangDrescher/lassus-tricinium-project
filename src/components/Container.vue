<script setup>
defineProps({
    props: {
        fluid: {
            type: Boolean,
            default: false,
        },
    },
});
</script>

<template>
    <div :class="{ 'mx-auto px-2 md:px-4': fluid, container: !fluid }">
        <slot />
    </div>
</template>
