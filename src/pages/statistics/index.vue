<template>
    <Container>
        <div class="grid grid-cols-4 gap-4">
            <aside>
                <div class="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
                    <ul class="space-y-2">
                        <StatisticsSidebarItem :href="localePath('statistics')">{{ $t('overview')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-clefs')">{{ $t('clefs')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-finalis')">{{ $t('finalis')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-modes')">{{ $t('modes')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-transpositions')">{{ $t('transpositions')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-cantus-firmus')">{{ $t('cantusFirmus')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem :href="localePath('statistics-words')">{{ $t('words')}}</StatisticsSidebarItem>
                    </ul>
                </div>
            </aside>
            <div class="col-span-3">
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
defineI18nRoute({
    paths: {
        de: '/statistiken',
    },
});
</script>
