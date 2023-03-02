<script setup>
const props = defineProps({
    icon: {
        type: String,
        default: 'exclamation-circle',
    },
    type: {
        type: String,
        default: 'info',
    },
    title: String,
});

const colorClasses = computed(() => {
    switch (props.type) {
        case 'info':
        default:
            return 'bg-orange-100 border-orange-500 text-orange-900';
    }
});
</script>

<template>
    <div class="border-t-4 rounded-b px-4 py-3 shadow-md" :class="colorClasses" role="alert">
        <div class="flex gap-3">
            <div>
                <Icon :name="`heroicons:${icon}`" class="text-xl" />
            </div>
            <div class="flex items-center">
                <div class="font-bold">{{ title }}</div>
                <div class="text-sm">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
