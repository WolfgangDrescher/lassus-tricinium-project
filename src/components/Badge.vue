<script setup>
import { toRefs } from 'vue';

const props = defineProps({
    textSize: {
        default: 'base',
    },
});
// text-xs text-sm text-base text-lg text-xl
const { text } = toRefs(props);
</script>

<template>
    <div :class="`py-2 px-4 text-${textSize} leading-3 text-indigo-700 rounded-full bg-indigo-100 border border-indigo-200`">
        <slot></slot>
    </div>
</template>
