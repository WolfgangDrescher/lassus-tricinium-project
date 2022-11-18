<template>
    <Container>
        <div class="grid grid-cols-4 gap-4">
            <aside>
                <div class="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
                    <ul class="space-y-2">
                        <StatisticsSidebarItem href="/statistics">{{ $t('overview')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/clefs">{{ $t('clefs')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/finalis">{{ $t('finalis')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/modes">{{ $t('modes')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/transposition">{{ $t('transpositions')}}</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/words">{{ $t('words')}}</StatisticsSidebarItem>
                    </ul>
                </div>
            </aside>
            <div class="col-span-3">
                <slot>
                    Index
                </slot>
            </div>
        </div>
    </Container>
</template>
