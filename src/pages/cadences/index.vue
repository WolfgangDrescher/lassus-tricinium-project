<script setup>
defineI18nRoute({
    paths: {
        de: '/kadenzen',
    },
});

const { data: cadenceData } = await useAsyncData('cadences', () => queryContent('/cadences').find())
const { data: triciniumData } = await useFetch('/api/tricinium');
const tricinia = useTricinium(triciniumData.value);

function findTricinium(id) {
    return tricinia.find(t => t.id === id);
}
</script>

<template>
    <Container>
        <Heading>{{ $t('cadences') }}</Heading>
        <div class="grid grid-cols-2 gap-4">
            <div v-for="cadence in cadenceData" :key="cadence._id">
                <CadenceListItem :cadence="cadence" :tricinium="findTricinium(cadence.triciniumId)" />
            </div>
        </div>
    </Container>
</template>
