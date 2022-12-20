<script setup>
import { Twitter } from '@ckpack/vue-color';
import {default as tailwindColors} from 'tailwindcss/colors';
import { onClickOutside } from '@vueuse/core';

const colorNames = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];

const colors = colorNames.map(name => tailwindColors[name][500]);

const isOpen = ref(false);
const colorPicker = ref();

defineProps(['label', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

function update(value) {
    emit('update:modelValue', value.hex);
    isOpen.value = false;
}

onClickOutside(colorPicker, () => {
    isOpen.value = false;
});
</script>

<template>
    <FormGroup :label="label" class="relative">
        <Button :style="{backgroundColor: modelValue}" @click="isOpen = !isOpen" class="font-mono">{{ modelValue }}</Button>
        <div class="absolute top-12" v-if="isOpen">
            <Twitter ref="colorPicker" :model-value="modelValue" @update:modelValue="update" :default-colors="colors" />
        </div>
    </FormGroup>
</template>
