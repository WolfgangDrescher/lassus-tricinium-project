<script setup>
const isOpen = ref(false);
function toggle() {
    isOpen.value = !isOpen.value;
};
function close() {
    isOpen.value = false;
}
</script>

<template>
    <nav class="bg-gray-100 py-5" :class="{'is-open': isOpen}">
        <Container>
            <div class="flex flex-wrap justify-between items-center mx-auto">
                <a href="/" class="flex">
                    <span class="self-center text-2xl font-bold whitespace-nowrap">Lassus Tricinium Project</span>
                </a>
                <button
                    type="button"
                    @click="toggle"
                    class="inline-flex items-center p-2 ml-3 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    <Icon name="heroicons-solid:bars-3" />
                </button>
                <div class="hidden w-full md:block md:w-auto" id="navbar-navigation">
                    <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0">
                        <NavigationItem :href="localePath('index')" @click="close">{{ $t('home') }}</NavigationItem>
                        <NavigationItem :href="localePath('about')" @click="close">{{ $t('about') }}</NavigationItem>
                        <NavigationItem :href="localePath('tricinium')" @click="close">{{ $t('tricinia') }}</NavigationItem>
                        <NavigationItem :href="localePath('cadences')" @click="close">{{ $t('cadences') }}</NavigationItem>
                        <NavigationItem :href="localePath('statistics')" @click="close">{{ $t('statistics') }}</NavigationItem>
                        <NavigationItem :href="localePath('critical-report')" @click="close">{{ $t('criticalReport') }}</NavigationItem>
                    </ul>
                </div>
            </div>
        </Container>
    </nav>
</template>

<style scoped>
.is-open #navbar-navigation {
    @apply block;
}
</style>
