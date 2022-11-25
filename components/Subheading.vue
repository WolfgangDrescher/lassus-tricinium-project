<template>
    <component :is="level ? `h${level}` : 'div'" class="text-xl font-sans font-extrabold font-w mb-2">
        <slot />
    </component>
</template>

<script setup>
defineProps({
    level: {
        type: Number,
        default: null,
        validator (value) {
            return value >= 1 && value <= 6;
        },
    },
});
</script>
