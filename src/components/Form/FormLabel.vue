<script setup>
const props = defineProps(['label']);
</script>

<template>
    <div class="flex flex-col w-full">
        <div v-if="label">
            <label class="text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2">{{ label }}</label>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>
