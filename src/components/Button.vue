<script setup>
const props = defineProps({
    block: {
        type: Boolean,
        default: false,
    },
    outline: {
        type: Boolean,
        default: false,
    },
    selected: {
        type: Boolean,
        default: false,
    },
    hover: {
        type: Boolean,
        default: true,
    },
});

const dynamicClasses = computed(() => {
    return {
        'w-full': props.block,
        'text-white bg-primary-500': (!props.outline && !props.selected) || props.selected,
        'bg-gray-100 border-1 border-gray-200': props.outline && !props.selected,
        'hover:text-white hover:bg-primary-500': props.outline && !props.selected && props.hover,
        'focus:outline-none focus:border focus:border-primary-300 focus:ring focus:ring-primary-200': props.hover,
    };
});
</script>

<template>
    <button @click="onClick" :class="dynamicClasses" class="text-center px-3 py-2 text-sm border-gray-300 rounded border border-transparent shadow-sm">
        <slot></slot>
    </button>
</template>
