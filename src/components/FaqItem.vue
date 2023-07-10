<script setup>
defineProps({
    item: Object,
});

const open = ref(false);

function toggle() {
    open.value = !open.value;
}
</script>

<template>
    <Card :title="item.title" :click-title="toggle" :open="open">
        <ContentRenderer v-show="open" :value="item" />
    </Card>
</template>