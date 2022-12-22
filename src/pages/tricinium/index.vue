<script setup>
const { t } = useI18n();
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
    { value: 'composer', text: t('composer') },
    { value: 'mode', text: t('mode') },
    { value: 'transposition', text: t('transposition') },
    { value: 'clefs', text: t('clefs') },
    { value: 'finalis', text: t('finalis') },
    { value: 'cantusFirmus', text: t('cantusFirmus') },
];

const tableItems = computed(() => {
    return filteredElements.value.map(tricinium => {
        return {
            id: tricinium.id,
            nr: tricinium.nr,
            title: tricinium.title,
            composer: tricinium.composer,
            mode: tricinium.mode && t(`mode.${tricinium.mode}`),
            transposition: tricinium.transposition && t(`transposition.${tricinium.transposition}`),
            clefs: tricinium.clefs,
            finalis: tricinium.finalis,
            cantusFirmus: tricinium.cantusFirmus && t(`cantusFirmus.${tricinium.cantusFirmus}`),
        };
    });
});
</script>

<template>
    <Container>
        <Heading>{{ $t('tricinia') }}</Heading>

        <TriciniumFilter />

        <div class="my-4 flex">
            <div class="flex items-center">
                {{ $t('nTriciniaFoundForSerachParams', filteredElements.length) }}
            </div>
            <div class="ml-auto flex gap-4 items-center">
                <template v-if="viewOptions.viewMode === 'score'">
                    <div>
                        <label>
                            <input type="checkbox" v-model="viewOptions.showLyrics" />
                            {{ $t('showLyrics') }}
                        </label>
                    </div>
                    <div class="w-28">
                        <FormDropdown v-model="viewOptions.scoreDisplay" :search-enabled="false" :options="scoreOptions" :badge-show-remove-button="false" />
                    </div>
                </template>
                <div class="grid grid-cols-2 gap-1">
                    <Button @click="viewOptions.viewMode='table'" outline :selected="viewOptions.viewMode === 'table'">
                        <Icon name="heroicons-solid:view-list" />
                    </Button>
                    <Button @click="viewOptions.viewMode='score'" outline :selected="viewOptions.viewMode === 'score'">
                        <Icon name="heroicons-solid:view-grid" />
                    </Button>
                </div>
            </div>
        </div>
        
        <div v-if="viewOptions.viewMode === 'score'" class="grid grid-cols-2 gap-4">
            <div v-for="tricinium in filteredElements" :key="tricinium.id">
                <TriciniumListItem :tricinium="tricinium" :score-display="viewOptions.scoreDisplay" :show-lyrics="viewOptions.showLyrics" />
            </div>
        </div>
        <DataTable v-else :items="tableItems" :headers="tableHeaders" small>
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
