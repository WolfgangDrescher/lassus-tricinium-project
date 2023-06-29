<script setup>
defineProps({
    item: Object,
});
</script>

<template>
    <Card :title="item.title">
        <ContentRenderer :value="item" />
    </Card>
</template>