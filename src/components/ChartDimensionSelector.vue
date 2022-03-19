<script setup>
import { toRefs } from 'vue';
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
    <div class="grid grid-cols-3 gap-4 my-4">
        <div class="flex items-center">
            Add additional chart dimension
        </div>
        <div class="col-span-2">
            <Dropdown :options="options" :model-value="props.modelValue" @update:modelValue="onChange"></Dropdown>
        </div>
    </div>
</template>
