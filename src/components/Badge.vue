<script setup>
const props = defineProps({
    textSize: {
        default: 'base',
    },
    removable: {
        type: Boolean,
        default: false,
    },
    selected: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['remove']);

function remove() {
    emit('remove');
}

// text-xs text-sm text-base text-lg text-xl
</script>

<template>
    <div class="relative py-1 px-3 leading-3 rounded-full border" :class="{ [`text-${textSize}`]: true, 'pr-7': removable, 'border-primary-700 text-white bg-primary-700': selected, 'border-primary-200 text-primary-700 bg-primary-100': !selected}">
        <slot></slot>
        <button v-if="removable" @click="remove" class="absolute h-full aspect-[1/1] top-0 right-0 bg-primary-100 border-l border-primary-200 hover:bg-red-300 hover:border-l-transparent hover:ring-1 hover:ring-red-500 hover:border-red-400 hover:text-red-600 rounded-r-full flex justify-center items-center text-xs">
            <Icon name="heroicons-solid:x-mark" />
        </button>
    </div>
</template>
