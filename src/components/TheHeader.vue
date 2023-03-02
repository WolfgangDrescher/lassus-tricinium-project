<script setup>
const localePath = useLocalePath();
const isOpen = ref(false);

function toggle() {
    isOpen.value = !isOpen.value;
}
</script>

<template>
    <header class="bg-red-500 text-white bg-patter">
        <div class="flex justify-between items-center py-2 px-4 gap-4">
            <img src="/mhfr-logo-white.svg" class="hidden md:block max-h-[50px] mx-auto" alt="Hochschule für Musik Freiburg" />
            <div class="grow flex items-center gap-4">
                <div class="font-extrabold text-lg md:text-2xl">
                    <NuxtLink :to="localePath('/')" @click="isOpen = false">
                        Lassus Tricinium Project
                    </NuxtLink>
                </div>
            </div>
            <div class="flex justify-end items-center">
                Deutsch
                <button type="button" @click="toggle" class="inline-flex items-center p-2 ml-3 rounded-lg md:hidden hover:bg-red-300 focus:outline-none focus:ring focus:ring-red-100 focus:ring-opacity-50">
                    <Icon name="heroicons-solid:bars-3" class="text-xl" />
                </button>
            </div>
        </div>
        <TheNavigation :open="isOpen" @item-selected="isOpen = false" />
    </header>
</template>
