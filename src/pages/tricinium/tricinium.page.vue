<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Heading from '../../components/Heading.vue';
import DataTable from '../../components/DataTable.vue';
import TriciniumTextDiff from '../../components/TriciniumTextDiff.vue';
import MidiPlayer from '../../components/MidiPlayer.vue';
import InteractiveHumdrumScore from '../../components/InteractiveHumdrumScore.vue';
import ClientOnly from '../../components/ClientOnly.js';
import { useTricinium } from '../../composables/useTricinium';
import { MeasureFilter } from '../../classes/HumdrumFilters';
import HyperLink from '../../components/HyperLink.vue';

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});
const tricinium = useTricinium(props.tricinium);

const interactiveHumdrumScore = ref(null);
const audioDataUrl = ref(null);

async function interactiveHumdrumScoreMounted() {
    const midiBase64 = await interactiveHumdrumScore.value?.verovioCanvas?.callVerovioMethod('renderToMIDI', {
            midiTempoAdjustment: 4,
        });
    if(midiBase64) {
        audioDataUrl.value = `data:audio/midi;base64,${midiBase64}`;
    }
}

function addMeasureFilter(value) {
    interactiveHumdrumScore.value.addFilter(new MeasureFilter(value));
}
</script>

<template>
    <Heading>Tricinium</Heading>
    <DataTable :items="tricinium.lyrics?.map((l, i) => ({'#': i + 1, ...l})) || []">
        <template #item.measures="{ item }">
            <HyperLink href="#0" @click="addMeasureFilter(item.measures)">
                {{ item.measures }}
            </HyperLink>
        </template>
    </DataTable>
    <TriciniumTextDiff :tricinium="tricinium" />
    <ClientOnly>
        <MidiPlayer :url="audioDataUrl" />
        <Suspense>
            <InteractiveHumdrumScore ref="interactiveHumdrumScore" :url="tricinium.rawFile" @mounted="interactiveHumdrumScoreMounted" />
        </Suspense>
    </ClientOnly>
    <!-- <pre v-text="tricinium" class="w-full overflow-y-auto"></pre> -->
</template>
