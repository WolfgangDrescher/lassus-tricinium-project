<script setup>
import TheNavigation from '../components/TheNavigation.vue';
</script>

<template>
    <header>
        <TheNavigation />
    </header>
    <main class="py-8">
        <slot></slot>
    </main>
</template>
