<script setup>
const props = defineProps({
    all: Boolean,
});

const emit = defineEmits(['load']);
const el = ref(null);

watch(() => props.all, (value) => {
    if (value === true) {
        window.removeEventListener('scroll', handleScroll);
    }
});

function handleScroll(event) {
    if (el.value.getBoundingClientRect().bottom < window.innerHeight) {
        emit('load', event);
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <div ref="el">
        <slot></slot>
    </div>
</template>