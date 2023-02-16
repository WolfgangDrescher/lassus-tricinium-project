<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

useHead({
    title: t('tricinia'),
});

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);
const { filteredElements } = useTriciniumFilter(tricinia);

const viewOptions = useTriciniumViewOptionsStore();

const scoreOptions = [
    {
        value: 'lassus',
        text: 'Lassus',
    },
    {
        value: 'ulenberg',
        text: 'Ulenberg',
    },
    {
        value: 'none',
        text: t('none'),
    },
];

const tableHeaders = [
    { value: 'nr', text: '#', align: 'right' },
    { value: 'title', text: t('title') },
    { value: 'incipit', text: t('incipit') },
    { value: 'composer', text: t('composer') },
    { value: 'mode', text: t('mode') },
    { value: 'transposition', text: t('transposition') },
    { value: 'clefs', text: t('clefs') },
    { value: 'finalis', text: t('finalis') },
    { value: 'cantusFirmus', text: t('cantusFirmus') },
];

const tableItems = computed(() => {
    return filteredElements.value.map(tricinium => {
        const voices = (tricinium.cantusFirmusAsString && tricinium.cantusFirmusAsString.split(',').map(cf => cf.trim())) ?? [];
        return {
            id: tricinium.id,
            nr: tricinium.nr,
            title: tricinium.title,
            incipit: tricinium.incipit,
            composer: tricinium.composer,
            mode: tricinium.mode && t(`mode.${tricinium.mode}`),
            transposition: tricinium.transposition && t(`transposition.${tricinium.transposition}`),
            clefs: tricinium.clefs,
            finalis: tricinium.finalis,
            cantusFirmus: voices.map(voice => t(`cantusFirmus.${voice}`)).join(', '),
        };
    });
});
</script>

<template>
    <Container>
        <Heading>{{ $t('tricinia') }}</Heading>

        <TriciniumFilter />

        <div class="my-4 flex flex-col md:flex-row gap-4">
            <div class="flex items-center">
                {{ $t('nOutOfTotalTriciniaFoundForSerachParams', { n: filteredElements.length, total: tricinia.length }) }}
            </div>
            <div class="ml-auto flex gap-4 items-center">
                <template v-if="viewOptions.viewMode === 'score'">
                    <div>
                        <FormCheckbox v-model="viewOptions.showLyrics" :label="$t('showLyrics')" />
                    </div>
                    <div class="w-28">
                        <FormDropdown v-model="viewOptions.scoreDisplay" :search-enabled="false" :options="scoreOptions" :badge-show-remove-button="false" />
                    </div>
                </template>
                <ButtonGroup>
                    <Button @click="viewOptions.viewMode='table'" outline :selected="viewOptions.viewMode === 'table'">
                        <Icon name="heroicons-solid:view-list" />
                    </Button>
                    <Button @click="viewOptions.viewMode='score'" outline :selected="viewOptions.viewMode === 'score'">
                        <Icon name="heroicons-solid:view-grid" />
                    </Button>
                </ButtonGroup>
            </div>
        </div>
        
        <div v-if="viewOptions.viewMode === 'score'" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div v-for="tricinium in filteredElements" :key="tricinium.id">
                <TriciniumListItem :tricinium="tricinium" :score-display="viewOptions.scoreDisplay" :show-lyrics="viewOptions.showLyrics" />
            </div>
        </div>
        <DataTable v-else :items="tableItems" :headers="tableHeaders" small>
            <template #[`head.cantusFirmus`]="{ field }">
                <span class="whitespace-nowrap">{{ field.text }}</span>
            </template>
            <template #[`item.nr`]="{ item }">
                <div class="text-right">{{ item.nr }}</div>
            </template>
            <template #[`item.finalis`]="{ item }">
                <div class="text-center">{{ item.finalis }}</div>
            </template>
            <template #[`item.title`]="{ item }">
                <HyperLink :href="localePath({ name: 'tricinium-id', params: { id: item.id }})">
                    {{ item.title }}
                </HyperLink>
            </template>
        </DataTable>
    </Container>
</template>
