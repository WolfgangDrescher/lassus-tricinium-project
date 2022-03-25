<script setup>
defineProps({
    active: Boolean,
});
</script>

<template>
    <button href="#" class="py-2 px-4 border-b-2" :class="active ? 'border-primary-600 text-primary-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'">
        <slot></slot>
    </button>
</template>
