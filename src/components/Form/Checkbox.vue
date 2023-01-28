<script setup>
defineProps(['label', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

function onChange(event) {
    emit('update:modelValue', event.target.checked);
}
</script>

<template>
    <FormGroup>
        <label class="block">
            <div class="flex gap-2">
                <div class="shrink">
                    <input type="checkbox" @input="onChange" :checked="modelValue"/>
                </div>
                <div class="grow">
                    {{ label }}
                </div>
            </div>
        </label>
    </FormGroup>
</template>
