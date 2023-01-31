<script setup>
const { t } = useI18n();
useHead({
    title: t('canon'),
});

defineI18nRoute({
    paths: {
        de: '/canon',
    },
});

const { data } = await useAsyncData('canon', () => queryContent('/canon').findOne())
</script>

<template>
    <Container>
        <FormattedText>
            <ContentRenderer :value="data" />
        </FormattedText>
    </Container>
</template>
