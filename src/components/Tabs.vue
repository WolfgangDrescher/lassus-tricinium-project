<script setup>
const props = defineProps({
    items: Object,
});

const selectedTab = ref(props.items[0].value);

const slideDirection = computed(() => {
    return (item) => {
        return props.items.findIndex(i => selectedTab.value === i.value) < props.items.findIndex(i => item === i.value) ? 'prev' : 'next';
    };
});
</script>

<template>
    <div>
        <div class="border-b border-gray-200">
            <div class="flex flex-wrap gap-4">
                <TabPill v-for="item in items" :key="item.value" @click="selectedTab = item.value" :active="selectedTab === item.value">{{ item.text }}</TabPill>
            </div>
        </div>
        <div class="py-4 overflow-x-hidden">
            <template v-for="item in items" :key="item.value">
                <div v-if="selectedTab === item.value">
                    <slot :name="`tabItem.${item.value}`"></slot>
                </div>
            </template>
        </div>
    </div>
</template>
