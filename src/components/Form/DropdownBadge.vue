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
    <div class="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-primary-700 bg-primary-100 border border-primary-300">
        <div class="text-xs font-normal leading-none max-w-full flex-initial">{{ props.text || props.value }}</div>
        <div v-if="props.showRemoveButton" @click="removeOption" class="cursor-pointer flex flex-auto flex-row-reverse">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
</template>
