<script setup>
defineI18nRoute({
    paths: {
        de: '/kadenzen',
    },
});

const { data: cadenceData } = await useAsyncData('cadences', () => queryContent('/cadences').find())
const { data: triciniumData } = await useFetch('/api/tricinium');
const tricinia = useTricinium(triciniumData.value);

const cadences = cadenceData.value.map(cadence => {
    return Object.assign({}, cadence, {
        tricinium: findTricinium(cadence.triciniumId),
    });
});

const { filteredElements } = useCadenceFilter(cadences);

const showModernClefs = ref(false);

function findTricinium(id) {
    return tricinia.find(t => t.id === id);
}
</script>

<template>
    <Container>
        <Heading>{{ $t('cadences') }}</Heading>

        <CadenceFilter />
        
        <div class="my-4 flex">
            <div class="flex items-center">
                {{ $t('nCadencesFoundForSerachParams', filteredElements.length) }}
            </div>
            <div class="ml-auto flex gap-4 items-center">
                <div>
                    <label>
                        <input type="checkbox" v-model="showModernClefs" />
                        {{ $t('showModernClefs') }}
                    </label>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div v-for="cadence in filteredElements" :key="cadence._id">
                <CadenceListItem :cadence="cadence" :modern-clefs="showModernClefs" />
            </div>
        </div>
    </Container>
</template>
