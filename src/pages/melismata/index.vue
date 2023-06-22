<script setup>
const { t } = useI18n();
useHead({
    title: t('melismata'),
});

defineI18nRoute({
    paths: {
        de: '/melismen',
    },
});

const { data: melismaData } = await useAsyncData('melisma', () => queryContent('/melisma').find())
const { data: triciniumData } = await useFetch('/api/tricinium');
const tricinia = useTricinium(triciniumData.value);
const melismata = useMelisma(melismaData.value, tricinia);

const { filteredElements } = useTriciniumFilter(tricinia);

const filteredMelismata = computed(() => {
    return melismata.filter(melisma => filteredElements.value.map(t => t.id).includes(melisma.triciniumId));
});

const melismaKeys = computed(() => {
    return filteredMelismata.value.reduce((acc, melisma) => {
        acc[melisma.id] = melisma.noteString;
        return acc;
    }, {});
});

const melismaGroups = computed(() => {
    const melismaTypes = [...new Set(Object.values(melismaKeys.value))]
    return melismaTypes.map((key) => {
        return {
            key,
            melismata: filteredMelismata.value.filter(melisma => melismaKeys.value[melisma.id] === key),
        };
    }).sort((a, b) => b.melismata.length - a.melismata.length);
});

const { items, addItems } = useArrayLoader(melismaGroups, 12);
</script>

<template>
    <Container>
        <Heading>{{ $t('melismata') }}</Heading>

        <TriciniumFilter />

        <div class="my-4 flex flex-col md:flex-row gap-4">
            <div class="flex items-center">
                {{ $t('nOutOfTotalMelismataFoundForSerachParams', { n: filteredMelismata.length, total: melismaData.length, groupCount: melismaGroups.length }) }}
            </div>
        </div>

        <InfiniteScroll @load="addItems()" :all="items.length === melismaGroups.length" :key="filteredElements.map(e => e.id).join(',')">
            <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                <div v-for="melismaGroup in items" :key="melismaGroup.key">
                    <Card>
                        <MelismaSwiper :melismata="melismaGroup.melismata" />
                    </Card>
                </div>
            </div>
        </InfiniteScroll>
    </Container>
</template>
