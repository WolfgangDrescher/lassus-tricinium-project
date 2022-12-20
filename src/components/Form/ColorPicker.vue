<script setup>
import { Twitter } from '@ckpack/vue-color';
import { onClickOutside } from '@vueuse/core';
import { HumdrumFilter } from '../../classes/HumdrumFilters.js';

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

function toggleColorPicker(event) {
    event.stopPropagation();
    isOpen.value = !isOpen.value;
}
</script>

<template>
    <FormGroup :label="label">
        <div class="relative">
            <Button :style="{backgroundColor: modelValue}" @click="toggleColorPicker" class="font-mono">{{ modelValue }}</Button>
            <div class="absolute top-12" v-if="isOpen" data-color-picker>
                <Twitter ref="colorPicker" :model-value="modelValue" @update:modelValue="update" :default-colors="HumdrumFilter.colors" />
            </div>
        </div>
    </FormGroup>
</template>
