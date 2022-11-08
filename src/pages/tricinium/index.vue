<script setup>
const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);
const { filteredElements } = useTriciniumFilter(tricinia);
</script>

<template>
    <Container>
        <Heading>Tricinium Liste</Heading>

        <TriciniumFilter />

        <div class="grid grid-cols-2 gap-4">
            <div v-if="!filteredElements.length">
                Keine Tricinien gefunden für diese Suchparameter.
            </div>
            <template v-else>
                <div v-for="tricinium in filteredElements" :key="tricinium.id">
                    <TriciniumListItem :tricinium="tricinium" />
                </div>
            </template>
        </div>
    </Container>
</template>
