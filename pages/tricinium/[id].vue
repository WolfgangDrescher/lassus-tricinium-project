<script setup>
import { MeasureFilter } from '@/classes/HumdrumFilters.js';

const { t } = useI18n();
const route = useRoute();
const { data } = await useAsyncData(`/api/tricinium/${route.params.id}`, () => {
    return $fetch(`/api/tricinium/${route.params.id}`)
});
const tricinium = useTricinium(data.value);

const interactiveHumdrumScore = ref(null);
const audioDataUrl = ref(null);

async function interactiveHumdrumScoreMounted({ callVerovioMethod }) {
    const midiBase64 = await callVerovioMethod('renderToMIDI', {
        midiTempoAdjustment: 4,
    });
    if (midiBase64) {
        audioDataUrl.value = `data:audio/midi;base64,${midiBase64}`;
    }
}

function addMeasureFilter(value) {
    interactiveHumdrumScore.value.addFilter(new MeasureFilter(value));
}

const sidebarOpen = ref(true);

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
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
];

const triciniumVerovioOptions = {
    spacingSystem: 24,
};

const infoItemsHeaders = [
    { value: 'title', text: t('title') },
    { value: 'incipit', text: t('incipit') },
    { value: 'composer', text: t('composer') },
    { value: 'rawFile', text: t('rawFile') },
    { value: 'vhv', text: t('vhv') },
    { value: 'mode', text: t('mode') },
    { value: 'transposition', text: t('transposition') },
    { value: 'finalis', text: t('finalis') },
    { value: 'clefs', text: t('clefs') },
];

const infoItems = [{
    id: tricinium.id,
    title: tricinium.title,
    incipit: tricinium.incipit,
    composer: tricinium.composer,
    rawFile: tricinium.rawFile,
    vhv: tricinium.rawFile,
    mode: tricinium.mode && t(`mode.${tricinium.mode}`),
    transposition: tricinium.transposition && t(`transposition.${tricinium.transposition}`),
    finalis: tricinium.finalis,
    clefs: tricinium.clefs,
}];

const useMordernClefs = ref(false);
</script>

<template>
    <Container :fluid="true">
        <div class="flex">
            <div class="flex-auto">
                <Heading>{{ `${tricinium.nr}. ${tricinium.title}` }}</Heading>
            </div>
            <div>
                <Button @click="toggleSidebar">
                    <template v-if="sidebarOpen">
                        {{ t('hideSidebar') }}
                    </template>
                    <template v-else>
                        {{ t('showSidebar') }}
                    </template>
                </Button>
            </div>
        </div>
        <div class="flex gap-4">
            <div class="flex-auto " :class="sidebarOpen ? 'w-1/2' : 'w-full'">
                <ClientOnly>
                    <MidiPlayer :url="audioDataUrl" />
                    <Suspense>
                        <InteractiveHumdrumScore ref="interactiveHumdrumScore" :url="tricinium.rawFile" @mounted="interactiveHumdrumScoreMounted" :verovio-options="triciniumVerovioOptions" />
                    </Suspense>
                </ClientOnly>
            </div>
            <div class="flex-auto" :class="sidebarOpen ? 'w-1/2' : 'w-0'">
                <Tabs :items="tabItems">

                    <template #[`tabItem.info`]>
                        <DataTable :items="infoItems" :headers="infoItemsHeaders" direction="column">
                            <template #[`item.vhv`]="{ item }">
                                <HyperLink :href="item.vhvHref" target="_blank">Verovio Humdrum Viewer</HyperLink>
                            </template>
                            <template #[`item.rawFile`]="{ item }">
                                <HyperLink :href="item.sourceFile || item.rawFile" target="_blank">{{ $t('viewScoreFileOnGithub') }}</HyperLink>
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
                        <label>
                            <input value="" type="checkbox" v-model="useMordernClefs" /> Show modern clefs
                        </label>
                        <ClientOnly>
                            <template v-for="voice in ['cantus', 'tenor', 'bassus']">
                                <VoiceAmbitus :tricinium="tricinium" :voice="voice" :modern-clefs="useMordernClefs" />
                            </template>
                        </ClientOnly>
                    </template>

                    <template #[`tabItem.ulenberg`]>
                        <ClientOnly>
                            <Suspense>
                                <InteractiveHumdrumScore :url="`https://raw.githubusercontent.com/WolfgangDrescher/ulenberg-psalmen-davids/master/kern/0${tricinium.id}.krn`" />
                            </Suspense>
                        </ClientOnly>
                    </template>

                    <template #[`tabItem.comments`]>
                        <ul class="grid gap-2" v-if="tricinium.comments.length">
                            <li v-for="(comment, index) in tricinium.comments" :key="index">{{ comment }}</li>
                        </ul>
                    </template>

                </Tabs>
            </div>
        </div>
    </Container>
</template>
