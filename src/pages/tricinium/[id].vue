<script setup>
import { storeToRefs } from 'pinia';
import { MeasureFilter } from '@/classes/HumdrumFilters.js';

const { t } = useI18n();
const localePath = useLocalePath();

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
const midiPlayer = ref(null);
const audioDataUrl = ref(null);

async function humdrumScoreMounted({ callVerovioMethod }) {
    const midiBase64 = await callVerovioMethod('renderToMIDI', {
        midiTempoAdjustment: 4,
    });
    if (midiBase64) {
        audioDataUrl.value = `data:audio/midi;base64,${midiBase64}`;
    }
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
    {
        value: 'kern',
        text: t('kern'),
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
    { value: 'cantusFirmus', text: t('cantusFirmus') },
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
    cantusFirmus: (() => {
        const cantusFirmus = tricinium.cantusFirmusAsString;
        const voices = cantusFirmus ? cantusFirmus.split(',').map(cf => cf.trim()) : [];
        return voices.map(voice => t(`cantusFirmus.${voice}`)).join(', ') || t('cantusFirmus.free');
    })(),
    transposition: tricinium.transposition && t(`transposition.${tricinium.transposition}`),
    finalis: tricinium.finalis,
    originalDocument: tricinium.originalDocument,
    originalDocumentOwner: tricinium.originalDocumentOwner,
    cantusUrlScan: tricinium.getVoiceUrlScan('cantus'),
    tenorUrlScan: tricinium.getVoiceUrlScan('tenor'),
    bassusUrlScan: tricinium.getVoiceUrlScan('bassus'),
}];

const store = useTriciniumViewOptionsStore();
const {
    showSidebar,
    showScore,
    splitViewWidth,
    triciniumScoreFilters,
    triciniumScoreManualFilters,
    triciniumExpertMode,
    ulenbergScoreFilters,
    ulenbergScoreManualFilters,
    ulenbergExpertMode,
} = storeToRefs(store);

const initialTriciniumManualFilters = ref(triciniumScoreManualFilters.value);
const initialUlenbergManualFilters = ref(ulenbergScoreManualFilters.value);

function updateSplitViewWidth(value) {
    splitViewWidth.value = value;
}

const { showModernClefs, showCadencesInScore } = storeToRefs(useCadenceHumdrumFiltersStore());

function toggleSidebar() {
    if (showSidebar.value == true && showScore.value == false) return;
    showSidebar.value = !showSidebar.value;
}

function toggleScore() {
    if (showScore.value == true && showSidebar.value == false) return;
    showScore.value = !showScore.value;
}

function onUpdateTriciniumExpertMode(value) {
    triciniumExpertMode.value = value;
    initialTriciniumManualFilters.value = '';
}

function onUpdateUlenbergExpertMode(value) {
    ulenbergExpertMode.value = value;
    initialUlenbergManualFilters.value = '';
}

function onNoteSelected(id, midiValues) {
    midiPlayer.value.skipToSeconds(midiValues.time / 1000);
}

const kern = ref('');
$fetch(tricinium.localRawFile).then(response => {
    return response.text();
}).then(value => {
    kern.value = value;
});

const scoreContainer = ref(null);
const selectedScoreElement = ref(null);
function onCursorPositionChanged(event, lineContent) {
    if (scoreContainer.value) {
        const field = lineContent.substring(0, event.position.column - 1).split('\t').length
        const id = `L${event.position.lineNumber}F${field }`;
        const selector = `g#note-${id}, g#rest-${id}, g#mRest-${id}, g#verse-${id}`;
        selectedScoreElement.value = scoreContainer.value.querySelector(selector);
    }
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
                                <Icon name="heroicons:arrow-left-circle" class="text-xl" />
                            </NuxtLink>
                        </div>
                        <div v-if="tricinium.nextId">
                            <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: tricinium.nextId }, hash: $route.hash })">
                                <Icon name="heroicons:arrow-right-circle" class="text-xl" />
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
        <SplitView :hide="!showSidebar ? 'right' : (!showScore ? 'left' : null)" @update:width="updateSplitViewWidth" :initial-width="splitViewWidth">
            <template v-slot:left>
                <MidiPlayer ref="midiPlayer" :url="audioDataUrl" />
                <NuxtErrorBoundary>
                    <div ref="scoreContainer">
                        <Suspense>
                            <HumdrumInteractiveScore
                                ref="humdrumScore"
                                :url="tricinium.localRawFile"
                                :iiif-manifest-url="tricinium.iiifManifestUrl"
                                @mounted="humdrumScoreMounted"
                                @update:filters="triciniumScoreFilters = $event"
                                :verovio-options="triciniumVerovioOptions"
                                :initial-filters="triciniumScoreFilters"
                                :initial-manual-filters="initialTriciniumManualFilters"
                                @update:manualFilters="triciniumScoreManualFilters = $event"
                                :expert-mode="triciniumExpertMode"
                                @update:expertMode="onUpdateTriciniumExpertMode"
                                @note-selected="onNoteSelected"
                            >
                                <template v-slot:default="slotProps">
                                    <template v-if="showCadencesInScore">
                                        <HumdrumCadenceHighlight v-for="cadence in cadences" :key="cadence.id" :cadence="cadence" :container="slotProps.scoreWrapper" />
                                    </template>
                                    <HumdrumNoteHightlight v-if="selectedScoreElement" :key="selectedScoreElement.id" :elem="selectedScoreElement" :container="slotProps.scoreWrapper" />
                                </template>
                            </HumdrumInteractiveScore>
                        </Suspense>
                    </div>
                    <template #error="{ error }">
                        <AlertMessage>
                            <p>{{ error }}</p>
                        </AlertMessage>
                    </template>
                </NuxtErrorBoundary>
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
                            <template #[`head.cantusFirmus`]="{ field }">
                                <span class="whitespace-nowrap">{{ field.text }}</span>
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
                                <HumdrumInteractiveScore
                                    :url="tricinium.localUlenbergRawFile"
                                    @update:filters="ulenbergScoreFilters = $event"
                                    :initial-filters="ulenbergScoreFilters"
                                    :initial-manual-filters="initialUlenbergManualFilters"
                                    @update:manualFilters="ulenbergScoreManualFilters = $event"
                                    :expert-mode="ulenbergExpertMode"
                                    @update:expertMode="onUpdateUlenbergExpertMode"
                                />
                            </Suspense>
                            <div class="mt-4">
                                <ButtonGroup>
                                    <Button outline>
                                        <NuxtLink :to="tricinium.ulenbergSourceFile" target="_blank">{{ $t('openOnGithub') }}</NuxtLink>
                                    </Button>
                                    <Button outline>
                                        <NuxtLink :to="tricinium.ulenbergVhvHref" target="_blank">{{ $t('openOnVhv') }}</NuxtLink>
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Card>
                    </template>

                    <template #[`tabItem.comments`]>
                        <ul class="grid gap-2" v-if="tricinium.comments.length">
                            <li v-for="(comment, index) in tricinium.comments" :key="index">{{ comment }}</li>
                        </ul>
                    </template>

                    <template #[`tabItem.cadences`]>
                        <div class="mb-4">
                            <CadenceTimeline :cadences="cadences" :total-beats="tricinium.beats" />
                        </div>
                        <div class="grid md:grid-cols-2 gap-2 mb-2">
                            <FormCheckbox v-model="showModernClefs" :label="$t('showModernClefs')" />
                            <FormCheckbox v-model="showCadencesInScore" :label="$t('showCadencesInScore')" />
                        </div>
                        <div class="@container">
                            <div class="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 gap-4 mt-4">
                                <div v-for="cadence in cadences" :key="cadence._id">
                                    <CadenceListItem :cadence="cadence" :short-title="true" :hide-info="true" />
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #[`tabItem.kern`]>
                        <div class="h-96 overflow-hidden">
                            <MonacoEditor
                                :model-value="kern"
                                :options="{
                                    readOnly: true,
                                    // theme: 'vs-light',
                                    tabSize: 16,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    scrollbar: {
                                        alwaysConsumeMouseWheel: false,
                                    }
                                }"
                                @cursorPositionChanged="onCursorPositionChanged"
                            />
                        </div>
                    </template>

                </Tabs>
            </template>
        </SplitView>
    </Container>
</template>
