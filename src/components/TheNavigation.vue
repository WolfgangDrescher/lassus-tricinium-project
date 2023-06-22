<script setup>
defineProps({
    open: Boolean,
});

const emit = defineEmits(['itemSelected']);

const localePath = useLocalePath();

function onClick() {
    emit('itemSelected');
}
</script>

<template>
    <nav class="bg-gray-100 p-3 md:p-5 hidden shadow md:shadow-none whitespace-nowrap overflow-x-auto" :class="{'is-open': open}" id="header-navigation">
        <div class="lg:container">
            <div class="w-full md:block md:w-auto">
                <ul class="flex flex-col md:flex-row md:space-x-4 lg:space-x-8 lg:justify-center">
                    <NavigationItem :href="localePath('index')" @click="onClick">{{ $t('home') }}</NavigationItem>
                    <NavigationItem :href="localePath('about')" @click="onClick">{{ $t('about') }}</NavigationItem>
                    <NavigationItem :href="localePath('tricinium')" @click="onClick">{{ $t('tricinia') }}</NavigationItem>
                    <NavigationItem :href="localePath('cadences')" @click="onClick">{{ $t('cadences') }}</NavigationItem>
                    <NavigationItem :href="localePath('melismata')" @click="onClick">{{ $t('melismata') }}</NavigationItem>
                    <NavigationItem :href="localePath('statistics')" @click="onClick">{{ $t('statistics') }}</NavigationItem>
                    <NavigationItem :href="localePath('critical-report')" @click="onClick">{{ $t('criticalReport') }}</NavigationItem>
                    <NavigationItem :href="localePath('learn')" @click="onClick">{{ $t('learn') }}</NavigationItem>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
#header-navigation.is-open {
    @apply block;
}

@screen md {
    #header-navigation {
        @apply block;
    }
}
</style>
