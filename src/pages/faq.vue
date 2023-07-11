<script setup>
const { t } = useI18n();

useHead({
    title: t('faq'),
});

defineI18nRoute({
    paths: {
        de: '/faq',
    },
});

const { data } = await useAsyncData('faq', () => queryContent('/faq').sort({ title: 1 }).find())
</script>

<template>
    <Container>
        <Heading>{{ $t('frequentlyAskedQuestions') }}</Heading>
        <FormattedText>
            <FaqContainer>
                <FaqItem v-for="item in data" :key="item._id" :item="item" />
            </FaqContainer>
        </FormattedText>
    </Container>
</template>
