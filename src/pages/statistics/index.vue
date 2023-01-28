<template>
    <Container>
        <div class="flex flex-col lg:flex-row gap-4">
            <aside class="lg:w-1/4 shrink-0">
                <div class="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
                    <ul class="space-y-2">
                        <StatisticsSidebarItem :href="localePath('statistics')">{{ $t('overview')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-clefs')">{{ $t('clefs')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-finalis')">{{ $t('finalis')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-modes')">{{ $t('modes')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-transpositions')">{{ $t('transpositions')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-cantus-firmus')">{{ $t('cantusFirmus')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-words')">{{ $t('words')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-cadences')">{{ $t('cadences')}}</StatisticsSidebarItem>
                    </ul>
                </div>
            </aside>
            <div class="grow">
                <slot>
                    <Heading>
                        {{ $t('overview') }}
                    </Heading>
                </slot>
            </div>
        </div>
    </Container>
</template>

<script setup>
useHead({
    title: t('statistics'),
});

defineI18nRoute({
    paths: {
        de: '/statistiken',
    },
});
</script>
