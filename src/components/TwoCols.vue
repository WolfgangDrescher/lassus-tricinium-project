<script setup>
defineProps({
    reverse: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div :class="reverse ? 'md:order-2' : ''">
            <div class="h-full flex items-center">
                <div class="w-full">
                    <slot name="first"></slot>
                </div>
            </div>
        </div>
        <div :class="reverse ? 'md:order-1' : ''">
            <div class="h-full flex items-center">
                <div class="w-full">
                    <slot name="second"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
