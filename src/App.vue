<script setup>
import Container from './components/Container.vue';
import TheNavigation from './components/TheNavigation.vue';
import { RouterView } from 'vue-router';
</script>

<template>
    <header>
        <TheNavigation />
    </header>
    <main class="py-8">
        <Container>
            <RouterView />
        </Container>
    </main>
</template>
