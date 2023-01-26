<script setup>
defineProps({
    noMx: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div class="my-4 italic text-sm text-center" :class="{'mx-0 sm:mx-4 md:mx-8 lg:mx-12': !noMx}">
        <slot></slot>
    </div>
</template>
