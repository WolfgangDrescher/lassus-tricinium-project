<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

useHead({
    title: t('tricinia'),
});

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);
const { filteredElements } = useTriciniumFilter(tricinia);
const { items, addItems } = useArrayLoader(filteredElements);

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
    { value: 'vhv', text: 'VHV' },
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
        const cantusFirmus = tricinium.cantusFirmusAsString;
        const voices = cantusFirmus ? cantusFirmus.split(',').map(cf => cf.trim()) : [];
        return {
            id: tricinium.id,
            nr: tricinium.nr,
            title: tricinium.title,
            vhv: tricinium.vhvHref,
            incipit: tricinium.incipit,
            composer: tricinium.composer,
            mode: tricinium.mode && t(`mode.${tricinium.mode}`),
            transposition: tricinium.transposition && t(`transposition.${tricinium.transposition}`),
            clefs: tricinium.clefs,
            finalis: tricinium.finalis,
            cantusFirmus: voices.map(voice => t(`cantusFirmus.${voice}`)).join(', ') || t('cantusFirmus.free'),
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
                    <VTooltip>
                        <Button @click="viewOptions.viewMode='table'" outline :selected="viewOptions.viewMode === 'table'">
                            <Icon name="heroicons-solid:view-list" />
                        </Button>
                        <template #popper>
                            {{ $t('tableView') }}
                        </template>
                    </VTooltip>
                    <VTooltip>
                        <Button @click="viewOptions.viewMode='score'" outline :selected="viewOptions.viewMode === 'score'">
                            <Icon name="heroicons-solid:view-grid" />
                        </Button>
                        <template #popper>
                            {{ $t('listView') }}
                        </template>
                    </VTooltip>
                </ButtonGroup>
            </div>
        </div>
        
        <InfiniteScroll v-if="viewOptions.viewMode === 'score'" @load="addItems()" :all="items.length === filteredElements.length">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div v-for="tricinium in items" :key="tricinium.id">
                    <TriciniumListItem :tricinium="tricinium" :score-display="viewOptions.scoreDisplay" :show-lyrics="viewOptions.showLyrics" />
                </div>
            </div>
        </InfiniteScroll>
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
            <template #[`item.vhv`]="{ item }">
                <HyperLink :href="item.vhv" target="_blank">
                    VHV
                </HyperLink>
            </template>
        </DataTable>
    </Container>
</template>
