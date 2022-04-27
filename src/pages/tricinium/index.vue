<script setup>
const tricinia = useTricinium(await $fetch('/api/tricinium'));
const { filteredElements } = useTriciniumFilter(tricinia);
</script>

<template>
    <Container>
        <Heading>Tricinium Liste</Heading>

        <TriciniumFilter />

        <div class="grid grid-cols-2 gap-4">
            <div v-for="tricinium in filteredElements" :key="tricinium.id">
                <TriciniumListItem :tricinium="tricinium" />
            </div>
        </div>
    </Container>
</template>
