<script setup>
const props = defineProps({
    title: String,
    borderless: {
        type: Boolean,
        default: false,
    },
    clickTitle: Function,
    open: {
        type: Boolean,
        default: true,
    },
});
</script>

<template>
    <div :class="{'p-6 shadow border border-gray-100 rounded': !borderless}">
        <div v-if="$slots.title || title" :class="{ 'cursor-pointer': clickTitle, 'border-b border-gray-200 pb-3 mb-3': !clickTitle || open}" @click="clickTitle">
            <div class="flex items-center">
                <div class="flex-grow">
                    <slot name="title">
                        <div class="text-xl font-medium leading-5 text-gray-800">
                            {{ title }}
                        </div>
                    </slot>
                </div>
                <div v-if="clickTitle" class="cursor-pointer">
                    <button @click.stop="clickTitle">
                        <Icon v-if="open" name="heroicons-solid:minus" class="text-xl" />
                        <Icon v-else name="heroicons-solid:plus" class="text-xl" />
                        <span class="sr-only">Toggle</span>
                    </button>
                </div>
            </div>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>
