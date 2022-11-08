<script setup>
const props = defineProps(['label', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

function onChange(event) {
    emit('update:modelValue', event.target.value);
}
</script>

<template>
    <FormGroup :label="props.label">
        <input :value="props.modelValue" @input="onChange" class="text-gray-600 focus:outline-none focus:border focus:border-primary-300 focus:ring focus:ring-primary-200 bg-white font-normal w-full flex items-center px-3 py-2 text-sm border-gray-300 rounded border shadow-sm" v-bind="{...$attrs, ...$props}" />
    </FormGroup>
</template>
