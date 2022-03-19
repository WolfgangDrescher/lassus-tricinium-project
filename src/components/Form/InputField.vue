<script setup>
import FormLabel from './FormLabel.vue';
const props = defineProps(['label', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

function onChange(event) {
    emit('update:modelValue', event.target.value);
}
</script>

<template>
    <FormLabel :label="props.label">
        <input :value="modelValue" @input="onChange" v-bind="$attrs" class="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 bg-white font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" />
    </FormLabel>
</template>
