<script setup>
const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);
const { filteredElements } = useTriciniumFilter(tricinia);
</script>

<template>
    <Container>
        <Heading>{{ $t('tricinia') }}</Heading>

        <TriciniumFilter />

        <div class="my-4">
            {{ $t('nTriciniaFoundForSerachParams', filteredElements.length) }}
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div v-for="tricinium in filteredElements" :key="tricinium.id">
                <TriciniumListItem :tricinium="tricinium" />
            </div>
        </div>
    </Container>
</template>
