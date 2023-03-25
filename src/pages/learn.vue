<script setup>
const { t } = useI18n();
useHead({
    title: t('learn'),
});

defineI18nRoute({
    paths: {
        de: '/lernen',
    },
});

const { data } = await useAsyncData('learn', () => queryContent('/learn').findOne())
</script>

<template>
    <Container>
        <FormattedText>
            <ContentRenderer :value="data" />
        </FormattedText>
    </Container>
</template>
