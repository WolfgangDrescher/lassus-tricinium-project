<script setup>
defineProps(['label', 'modelValue', 'groupLabel']);
const emit = defineEmits(['update:modelValue']);

function onChange(event) {
    emit('update:modelValue', event.target.checked);
}
</script>

<template>
    <FormGroup :label="groupLabel">
        <div class="flex">
            <label class="relative inline-flex items-center cursor-pointer slef-center">
                <input type="checkbox" @input="onChange" :checked="modelValue" class="sr-only peer">
                <div class="w-9 h-5 flex-shrink-0 flex-grow-0 bg-gray-200 peer-focus:outline-none peer-focus:ring peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-900 leading-3">
                    {{ label }}
                </span>
            </label>
        </div>
    </FormGroup>
</template>
