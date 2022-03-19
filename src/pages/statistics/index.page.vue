<script setup>
import StatisticsSidebarItem from '../../components/StatisticsSidebarItem.vue';
</script>

<template>
    <div class="grid grid-cols-4 gap-4">
        <div>
            <aside>
                <div class="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
                    <ul class="space-y-2">
                        <StatisticsSidebarItem href="/statistics">Overview</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/clefs">Clefs</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/finalis">Finalis</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/modes">Modes</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/transposition">Transposition</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/words">Words</StatisticsSidebarItem>
                        <StatisticsSidebarItem href="/statistics/cadences">Cadences</StatisticsSidebarItem>
                    </ul>
                </div>
            </aside>
        </div>
        <div class="col-span-3">
            <slot>
                Index
            </slot>
        </div>
    </div>
</template>
