<script setup>
const emit = defineEmits(['toggle']);

const props = defineProps({
    value: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    selected: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const toggleOption = () => {
    emit('toggleOption', props.value);
}
</script>

<template>
    <div @click="toggleOption" class="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-primary-100">
        <div class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-primary-100" :class="{'border-primary-600 hover:border-l-primary-600': props.selected}">
            <div class="w-full items-center flex">
                <div class="mx-2 leading-6">{{ props.text || props.value }}</div>
            </div>
        </div>
    </div>
</template>
