<script setup>
import { storeToRefs } from 'pinia';
import { MeasureFilter } from '@/classes/HumdrumFilters.js';

const { t } = useI18n();
const route = useRoute();
const { data } = await useAsyncData(`/api/tricinium/${route.params.id}`, () => {
    return $fetch(`/api/tricinium/${route.params.id}`);
});
const tricinium = useTricinium(data.value);

useHead({
    title: `${tricinium.nr}. ${tricinium.title}`,
    meta: [
        { name: 'description', content: tricinium.lyricsAsString() },
    ],
});

const { data: triciniaData } = await useAsyncData(`/api/tricinium`, () => {
    return $fetch(`/api/tricinium`);
});
const tricinia = useTricinium(triciniaData.value);

const { data: cadenceData } = await useAsyncData(`cadences-${tricinium.id}`, () => queryContent('/cadences').where({ triciniumId: tricinium.id }).find())

const cadences = useCadence(cadenceData.value ?? [], tricinia);

const humdrumScore = ref(null);
const audioDataUrl = ref(null);

async function humdrumScoreMounted({ callVerovioMethod, addFilter }) {
    const midiBase64 = await callVerovioMethod('renderToMIDI', {
        midiTempoAdjustment: 4,
    });
    if (midiBase64) {
        audioDataUrl.value = `data:audio/midi;base64,${midiBase64}`;
    }
    triciniumFilters.value.forEach((filter) => {
        addFilter(toRaw(filter));
    });
}

function addMeasureFilter(value) {
    humdrumScore.value.addFilter(new MeasureFilter(value));
}

const tabItems = [
    {
        value: 'info',
        text: t('info'),
    },
    {
        value: 'lyrics',
        text: t('lyrics'),
    },
    {
        value: 'ambitus',
        text: t('ambitus'),
    },
    {
        value: 'ulenberg',
        text: t('ulenberg'),
    },
    {
        value: 'comments',
        text: t('comments'),
    },
    {
        value: 'cadences',
        text: t('cadences'),
    },
];

const triciniumVerovioOptions = {
    spacingSystem: 24,
};

const infoItemsHeaders = [
    { value: 'title', text: t('title') },
    { value: 'incipit', text: t('incipit') },
    { value: 'composer', text: t('composer') },
    { value: 'mode', text: t('mode') },
    { value: 'transposition', text: t('transposition') },
    { value: 'finalis', text: t('finalis') },
    { value: 'clefs', text: t('clefs') },
    { value: 'rawFile', text: t('rawFile') },
    { value: 'vhv', text: t('vhv') },
    { value: 'originalDocument', text: t('originalDocument') },
    { value: 'partbooks', text: t('partbooks') },
];

const infoItems = [{
    id: tricinium.id,
    title: tricinium.title,
    incipit: tricinium.incipit,
    composer: tricinium.composer,
    rawFile: tricinium.rawFile,
    sourceFile: tricinium.sourceFile,
    vhvHref: tricinium.vhvHref,
    clefs: tricinium.clefs,
    mode: tricinium.mode && t(`mode.${tricinium.mode}`),
    transposition: tricinium.transposition && t(`transposition.${tricinium.transposition}`),
    finalis: tricinium.finalis,
    originalDocument: tricinium.originalDocument,
    originalDocumentOwner: tricinium.originalDocumentOwner,
    cantusUrlScan: tricinium.getVoiceUrlScan('cantus'),
    tenorUrlScan: tricinium.getVoiceUrlScan('tenor'),
    bassusUrlScan: tricinium.getVoiceUrlScan('bassus'),
}];

const store = useTriciniumViewOptionsStore();
const { showSidebar, showScore, splitViewWidth, triciniumFilters } = storeToRefs(store);

function splitViewWidthChanged(value) {
    splitViewWidth.value = value;
}

const { showModernClefs } = storeToRefs(useCadenceHumdrumFiltersStore());

function toggleSidebar() {
    if (showSidebar.value == true && showScore.value == false) return;
    showSidebar.value = !showSidebar.value;
}

function toggleScore() {
    if (showScore.value == true && showSidebar.value == false) return;
    showScore.value = !showScore.value;
}

function onFiltersChanges(filters) {
    triciniumFilters.value = filters;
}
</script>

<template>
    <Container :fluid="true">
        <div class="flex">
            <div class="flex-auto">
                <div class="mb-4">
                    <Heading class="mb-0">{{ `${tricinium.nr}. ${tricinium.title}` }}</Heading>
                    {{ tricinium.composer }}
                    <div class="flex flex-gap-4">
                        <div v-if="tricinium.prevId">
                            <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: tricinium.prevId }, hash: $route.hash })">
                                <Icon name="heroicons:arrow-left-circle" size="1.25rem" />
                            </NuxtLink>
                        </div>
                        <div v-if="tricinium.nextId">
                            <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: tricinium.nextId }, hash: $route.hash })">
                                <Icon name="heroicons:arrow-right-circle" size="1.25rem" />
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="grid grid-cols-2 gap-1">
                    <Button @click="toggleScore" outline :selected="showScore" :hover="false" :title="$t('showScore')">
                        <Icon name="heroicons-solid:musical-note" />
                    </Button>
                    <Button @click="toggleSidebar" outline :selected="showSidebar" :hover="false" :title="$t('showSidebar')">
                        <Icon name="heroicons-solid:information-circle" />
                    </Button>
                </div>
            </div>
        </div>
        <SplitView :hide="!showSidebar ? 'right' : (!showScore ? 'left' : null)" @width-changed="splitViewWidthChanged" :initial-width="splitViewWidth">
            <template v-slot:left>
                <MidiPlayer :url="audioDataUrl" />
                <Suspense>
                    <HumdrumInteractiveScore ref="humdrumScore" :url="tricinium.localRawFile" @mounted="humdrumScoreMounted" @filtersChanged="onFiltersChanges" :verovio-options="triciniumVerovioOptions" />
                </Suspense>
            </template>
            <template v-slot:right>
                <Tabs :items="tabItems">

                    <template #[`tabItem.info`]>
                        <DataTable :items="infoItems" :headers="infoItemsHeaders" direction="column">
                            <template #[`item.vhv`]="{ item }">
                                <HyperLink :href="item.vhvHref" target="_blank">Verovio Humdrum Viewer</HyperLink>
                            </template>
                            <template #[`item.rawFile`]="{ item }">
                                <HyperLink :href="item.sourceFile || item.rawFile" target="_blank">{{ $t('viewScoreFileOnGithub') }}</HyperLink>
                            </template>
                            <template #[`item.originalDocument`]="{ item }">
                                <div v-if="item.originalDocumentOwner" v-text="item.originalDocumentOwner"></div>
                                <HyperLink :href="item.originalDocument" target="_blank">{{ item.originalDocument }}</HyperLink>
                            </template>
                            <template #[`item.partbooks`]="{ item }">
                                <div class="flex gap-2">
                                    <HyperLink target="_blank" :href="item.cantusUrlScan">{{ $t('voice.cantus')}}</HyperLink>
                                    <HyperLink target="_blank" :href="item.tenorUrlScan">{{ $t('voice.tenor')}}</HyperLink>
                                    <HyperLink target="_blank" :href="item.bassusUrlScan">{{ $t('voice.bassus')}}</HyperLink>
                                </div>
                            </template>
                        </DataTable>
                    </template>

                    <template #[`tabItem.lyrics`]>
                        <DataTable :items="tricinium.lyrics?.map((l, i) => ({ '#': i + 1, ...l })) || []">
                            <template #[`item.measures`]="{ item }">
                                <HyperLink href="#0" @click="addMeasureFilter(item.measures)">
                                    {{ item.measures }}
                                </HyperLink>
                            </template>
                        </DataTable>
                        <TriciniumTextDiff :tricinium="tricinium" />
                    </template>

                    <template #[`tabItem.ambitus`]>
                        <FormCheckbox v-model="showModernClefs" :label="$t('showModernClefs')" />
                        <ClientOnly>
                            <div class="grid grid-cols-1 gap-4 mt-4">
                                <template v-for="voice in ['cantus', 'tenor', 'bassus']">
                                    <Card :title="$t(`voice.${voice}`)">
                                        <VoiceAmbitus :tricinium="tricinium" :voice="voice" :modern-clefs="showModernClefs" />
                                    </Card>
                                </template>
                            </div>
                        </ClientOnly>
                    </template>

                    <template #[`tabItem.ulenberg`]>
                        <Card>
                            <Suspense>
                                <HumdrumInteractiveScore :url="tricinium.localUlenbergRawFile" />
                            </Suspense>
                        </Card>
                    </template>

                    <template #[`tabItem.comments`]>
                        <ul class="grid gap-2" v-if="tricinium.comments.length">
                            <li v-for="(comment, index) in tricinium.comments" :key="index">{{ comment }}</li>
                        </ul>
                    </template>

                    <template #[`tabItem.cadences`]>
                        <FormCheckbox v-model="showModernClefs" :label="$t('showModernClefs')" />
                        <div class="@container">
                            <div class="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 gap-4 mt-4">
                                <div v-for="cadence in cadences" :key="cadence._id">
                                    <CadenceListItem :cadence="cadence" :short-title="true" :hide-info="true" />
                                </div>
                            </div>
                        </div>
                    </template>

                </Tabs>
            </template>
        </SplitView>
    </Container>
</template>
