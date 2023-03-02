<script setup>
const emit = defineEmits(['removeOption']);

const props = defineProps({
    value: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    showRemoveButton: {
        type: Boolean,
        default: true,
    },
});

const removeOption = () => {
    emit('removeOption', props.value);
};
</script>

<template>
    <div class="flex justify-center items-center font-medium px-2 bg-white rounded-full text-primary-700 border border-primary-300">
        <div class="text-xs font-normal leading-none max-w-full flex-initial py-1">{{ props.text || props.value }}</div>
        <div v-if="props.showRemoveButton" @click="removeOption" class="cursor-pointer flex flex-auto flex-row-reverse ml-1">
            <div>
                <Icon name="heroicons-solid:x-mark" class="text-xs" />
            </div>
        </div>
    </div>
</template>
