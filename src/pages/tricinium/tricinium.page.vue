<script setup>
import { ref } from 'vue';
import Heading from '../../components/Heading.vue';
import DataTable from '../../components/DataTable.vue';
import TriciniumTextDiff from '../../components/TriciniumTextDiff.vue';
import MidiPlayer from '../../components/MidiPlayer.vue';
import InteractiveHumdrumScore from '../../components/InteractiveHumdrumScore.vue';
import ClientOnly from '../../components/ClientOnly.js';
import { useTricinium } from '../../composables/useTricinium';
import { MeasureFilter } from '../../classes/HumdrumFilters';
import HyperLink from '../../components/HyperLink.vue';
import Container from '../../components/Container.vue';
import Tabs from '../../components/Tabs.vue';

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});
const tricinium = useTricinium(props.tricinium);

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

const tabItems = [
    {
        value: 'info',
        text: 'Info',
    },
    {
        value: 'text',
        text: 'Text',
    },
    {
        value: 'ambitus',
        text: 'Ambitus',
    },
    {
        value: 'ulenberg',
        text: 'Ulenberg',
    },
    {
        value: 'notes',
        text: 'Notes',
    },
];

const triciniumVerovioOptions = {
    spacingSystem: 24,
};
</script>

<template>
    <Container :fluid="true">
        <Heading>{{ `${tricinium.nr}. ${tricinium.title}` }}</Heading>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <ClientOnly>
                    <MidiPlayer :url="audioDataUrl" />
                    <Suspense>
                        <InteractiveHumdrumScore ref="interactiveHumdrumScore" :url="tricinium.rawFile" @mounted="interactiveHumdrumScoreMounted" :verovio-options="triciniumVerovioOptions" />
                    </Suspense>
                </ClientOnly>
            </div>
            <div>
                <Tabs :items="tabItems">
                    <template #[`tabItem.info`]>
                        <pre v-text="tricinium" class="w-full overflow-y-auto"></pre>
                    </template>
                    <template #[`tabItem.text`]>
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
                        <h1>Ambitus</h1>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </template>
                    <template #[`tabItem.ulenberg`]>
                        <ClientOnly>
                            <!-- <VerovioCanvas ref="verovioCanvas" :url="`https://raw.githubusercontent.com/WolfgangDrescher/ulenberg-psalmen-davids/master/kern/0${tricinium.id}.krn`" /> -->
                            <Suspense>
                                <InteractiveHumdrumScore :url="`https://raw.githubusercontent.com/WolfgangDrescher/ulenberg-psalmen-davids/master/kern/0${tricinium.id}.krn`" />
                            </Suspense>
                        </ClientOnly>
                    </template>
                    <template #[`tabItem.notes`]>
                        <h1>Notes</h1>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </template>
                </Tabs>
            </div>
        </div>
    </Container>
</template>
