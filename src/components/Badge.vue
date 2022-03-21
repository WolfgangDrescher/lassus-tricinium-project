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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</template>
