<script setup>
defineProps(['label', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

function onChange(event) {
    emit('update:modelValue', event.target.checked);
}
</script>

<template>
    <FormGroup>
        <label>
            <input type="checkbox" @input="onChange" :checked="modelValue"/>
            {{ label }}
        </label>
    </FormGroup>
</template>
