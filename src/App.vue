<script setup>
import Container from './components/Container.vue';
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <header>
        <div class="wrapper">
            <nav>
                <RouterLink :to="{ name: 'index' }">Home</RouterLink>
                <RouterLink :to="{ name: 'about' }">About</RouterLink>
                <RouterLink :to="{ name: 'tricinium_list' }">Tricinium</RouterLink>
            </nav>
        </div>
    </header>
    <main>
        <Container>
            <RouterView />
        </Container>
    </main>
</template>
