<script setup>
const props = defineProps(['label']);
</script>

<template>
    <div class="flex flex-col w-full">
        <div v-if="label || label === ''">
            <label class="label-text text-gray-800 text-sm mb-2">{{ label }}</label>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.label-text:empty:before {
    content: "\00a0";
}
</style>
