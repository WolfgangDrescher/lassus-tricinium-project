<script setup>
import DefaultLayout from './default.vue';
const localePath = useLocalePath();
</script>

<template>
    <DefaultLayout>
        <Container>
            <div class="flex flex-col lg:flex-row gap-4">
                <aside class="lg:w-1/4 shrink-0">
                    <div class="overflow-y-auto py-4 px-3 bg-gray-50 rounded">
                        <ul class="space-y-2">
                            <StatisticsSidebarItem :href="localePath('statistics')">{{ $t('overview') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-clefs')">{{ $t('clefs') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-finalis')">{{ $t('finalis') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-modes')">{{ $t('modes') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-transpositions')">{{ $t('transpositions') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-cantus-firmus')">{{ $t('cantusFirmus') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-words')">{{ $t('words') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-cadences')">{{ $t('cadences') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-melodic-intervals')">{{ $t('melodicIntervals') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-end-sound')">{{ $t('endSound') }}</StatisticsSidebarItem>
                            <StatisticsSidebarItem :href="localePath('statistics-frequent-cadences')">{{ $t('frequentCadences') }}</StatisticsSidebarItem>
                        </ul>
                    </div>
                </aside>
                <div class="grow min-w-0">
                    <slot></slot>
                </div>
            </div>
        </Container>
    </DefaultLayout>
</template>
