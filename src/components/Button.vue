<template>
    <button :class="block ? 'w-full': ''" class="text-white bg-primary-500 text-center focus:outline-none focus:border focus:border-primary-300 focus:ring focus:ring-primary-200 px-3 py-2 text-sm border-gray-300 rounded border border-transparent shadow-sm">
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
