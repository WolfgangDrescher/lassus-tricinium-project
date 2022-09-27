<template>
    <button :class="block ? 'w-full': ''" class="bg-primary-700 transition duration-150 ease-in-out hover:bg-primary-400 rounded text-white hover:text-black px-6 py-2 text-xs">
        <slot></slot>
    </button>
</template>

<script setup>
defineProps({
    block: {
        type: Boolean,
        default: false,
    },
});
</script>
