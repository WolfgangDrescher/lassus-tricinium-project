<script setup>
const props = defineProps({
    title: String,
});
</script>

<template>
    <div class="p-6 shadow border border-gray-100 rounded">
        <div v-if="$slots.title || title" class="border-b border-gray-200 pb-3 mb-3">
            <slot name="title">
                <div class="text-xl font-medium leading-5 text-gray-800">
                    {{ title }}
                </div>
            </slot>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>
