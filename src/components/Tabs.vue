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

onMounted(() => {
    const hash = typeof location !== 'undefined' && location.hash ? location.hash.split('#')[1] : null;
    if(hash) {
        selectedTab.value = hash;
    }
});
</script>

<template>
    <div>
        <div class="border-b border-gray-200">
            <div class="flex flex-wrap gap-4">
                <TabPill v-for="item in items" :key="item.value" :hash="item.value" @click="selectedTab = item.value" :active="selectedTab === item.value">{{ item.text }}</TabPill>
            </div>
        </div>
        <div class="py-4">
            <template v-for="item in items" :key="item.value">
                <div v-if="selectedTab === item.value">
                    <slot :name="`tabItem.${item.value}`"></slot>
                </div>
            </template>
        </div>
    </div>
</template>
