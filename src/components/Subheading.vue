<script setup>
defineProps({
    level: {
        type: Number,
        default: null,
        validator (value) {
            return value >= 1 && value <= 6;
        },
    },
    fontWeight: {
        type: String,
        default: 'extrabold',
    },
    fontSize: {
        type: String,
        default: 'xl',
    },
});
// font-thin font-extralight font-light font-normal font-medium font-semibold font-bold font-extrabold font-black
// text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl text-5xl text-6xl text-7xl text-8xl text-9xl
</script>

<template>
    <component :is="level ? `h${level}` : 'div'" class="font-sans mb-2" :class="`font-${fontWeight} text-${fontSize}`">
        <slot />
    </component>
</template>

