<script setup>
const props = defineProps({
    textSize: {
        default: 'base',
    },
    removable: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits('remove');

function remove() {
    emit('remove');
}

// text-xs text-sm text-base text-lg text-xl
</script>

<template>
    <div class="relative py-2 px-4 leading-3 text-primary-700 rounded-full bg-primary-100 border border-primary-200" :class="{[`text-${textSize}`]: true, 'pr-8': removable}">
        <slot></slot>
        <button v-if="removable" @click="remove" class="absolute h-full aspect-square top-0 right-0 bg-primary-100 border-l border-primary-200 hover:bg-red-300 hover:text-red-600 rounded-r-full flex justify-center items-center">
            <Icon name="heroicons-solid:x-mark" />
        </button>
    </div>
</template>
