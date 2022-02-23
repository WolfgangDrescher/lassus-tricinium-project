<script setup>
import Container from './components/Container.vue';
import TheNavigation from './components/TheNavigation.vue';
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <header>
        <TheNavigation />
    </header>
    <main>
        <Container>
            <RouterView />
        </Container>
    </main>
</template>
