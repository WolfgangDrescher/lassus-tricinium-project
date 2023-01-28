<script setup>
const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

useHead({
    title: t('statistics'),
});

defineI18nRoute({
    paths: {
        de: '/statistiken',
    },
});
</script>

<template>
    <div>
        <Heading>{{ $t('overview') }}</Heading>
    </div>
</template>
