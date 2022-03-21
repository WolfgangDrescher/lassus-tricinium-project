<script setup>
import Dropdown from './Form/Dropdown.vue';

const props = defineProps(['modelValue']);
const emit = defineEmits('update:modelValue');

const options = [
    {
        value: 'all',
        text: 'All',
    },
    {
        value: 'id',
        text: 'ID',
    },
    {
        value: 'title',
        text: 'Title',
    },
    {
        value: 'composer',
        text: 'Composer',
    },
    {
        value: 'mode',
        text: 'Mode',
    },
    {
        value: 'transposed',
        text: 'Transposed',
    },
    {
        value: 'clefs',
        text: 'Clefs',
    },
    {
        value: 'finalis',
        text: 'Finalis',
    },
];

function onChange(value) {
    emit('update:modelValue', value);
}
</script>

<template>
    <div class="grid grid-cols-2 my-4">
        <Dropdown :options="options" label="Add additional chart dimension" :model-value="props.modelValue" @update:modelValue="onChange"></Dropdown>
    </div>
</template>
