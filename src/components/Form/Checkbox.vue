<script setup>
defineProps(['label', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

function onChange(event) {
    emit('update:modelValue', event.target.value);
}
</script>

<template>
    <FormGroup>
        <label>
            <input type="checkbox" @change="onChange" :value="modelValue"/>
            {{ label }}
        </label>
    </FormGroup>
</template>
