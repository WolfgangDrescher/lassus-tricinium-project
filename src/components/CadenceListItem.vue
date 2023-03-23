<script setup>
import { storeToRefs } from 'pinia';
import { ModernClefsFilter, CustomFilter, IntervallsatzPresetFilter, HideLyricsFilter, HideCantusFirmusAnnotationFilter } from '@/classes/HumdrumFilters.js';

const props = defineProps({
    cadence: {
        type: Object,
        required: true,
    },
    shortTitle: {
        type: Boolean,
        default: false,
    },
    hideInfo: {
        type: Boolean,
        default: false,
    },
});

const { tricinium } = props.cadence;

const { t } = useI18n();

const tableHeaders = [
    {
        value: 'ultima',
        text: t('ultima'),
    },
    {
        value: 'degree',
        text: t('degree'),
    },
];

const tableItems = [
    {
        ultima: props.cadence.ultima,
        degree: romanize(props.cadence.degree),
    },
];

const data = ref(null);

const store = useCadenceHumdrumFiltersStore();
const { showModernClefs, showIntervallsatz, showLyrics, showScaleDegrees } = storeToRefs(store);

onMounted(async () => {
    const response = await fetch(`/cadences/${props.cadence.filename}`);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    data.value = await response.text();
});

const modernClefsFilter = new ModernClefsFilter();
const showIntervallsatzFilter = new IntervallsatzPresetFilter();
const showScaleDegreesFilter = new CustomFilter(`deg --circle --arrow --force-key ${props.cadence.ultima}`);
const hideLyricsFilter = new HideLyricsFilter();

const { addFilter, removeFilter, formattedScoreData } = useHumdrumScoreFormatter(data);

addFilter(new HideCantusFirmusAnnotationFilter());

if (showModernClefs.value) {
    addFilter(modernClefsFilter);
}

if (showIntervallsatz.value) {
    addFilter(showIntervallsatzFilter);
}

if (!showLyrics.value) {
    addFilter(hideLyricsFilter);
}

watch(showModernClefs, (value) => {
    if (value) {
        addFilter(modernClefsFilter);
    } else {
        removeFilter(modernClefsFilter.id);
    }
});

watch(showIntervallsatz, (value) => {
    if (value) {
        addFilter(showIntervallsatzFilter);
    } else {
        removeFilter(showIntervallsatzFilter.id);
    }
});

watch(showScaleDegrees, (value) => {
    if (value) {
        addFilter(showScaleDegreesFilter);
    } else {
        removeFilter(showScaleDegreesFilter.id);
    }
});

watch(showLyrics, (value) => {
    if (!value) {
        addFilter(hideLyricsFilter);
    } else {
        removeFilter(hideLyricsFilter.id);
    }
});

const audioDataUrl = ref(null);

async function verovioCanvasIsReady({ callVerovioMethod }) {
    const midiBase64 = await callVerovioMethod('renderToMIDI', {
        // midiTempoAdjustment: 4,
    });
    if (midiBase64) {
        audioDataUrl.value = `data:audio/midi;base64,${midiBase64}`;
    }
}

const location = `T. ${Math.ceil(props.cadence.endBeat / 8)} ♩ ${(props.cadence.endBeat % 8) + 1}`;
</script>

<template>
    <Card :title="location">
        <template v-slot:title v-if="!shortTitle">
            <div class="flex items-center">
                <div class="flex items-start justify-between w-full">
                    <div class="pl-3 w-full">
                        <div class="text-xl font-medium leading-5 text-gray-800">
                            <NuxtLink :href="`/tricinium/${tricinium.id}`">
                                {{ `${tricinium.nr}. ${tricinium.title}, ${location}` }}
                            </NuxtLink>
                        </div>
                        <div class="text-sm leading-normal pt-1 text-gray-500">
                            {{ tricinium.composer }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="flex flex-col gap-4 mt-4">
            <VerovioCanvas v-if="data" :data="formattedScoreData" view-mode="horizontal" :scale="35" lazy unload :lazy-delay="100" :options="{mnumInterval: 1}" @score-is-ready="verovioCanvasIsReady" />
            <MidiPlayer ref="midiPlayer" :url="audioDataUrl" />
            <DataTable v-if="!hideInfo" :items="tableItems" :headers="tableHeaders" direction="column" small />
        </div>
    </Card>
</template>
