<script setup>
import Container from '../components/Container.vue';
import TheNavigation from '../components/TheNavigation.vue';
</script>

<template>
    <header>
        <TheNavigation />
    </header>
    <main class="py-8">
        <Container>
            <slot></slot>
        </Container>
    </main>
</template>
