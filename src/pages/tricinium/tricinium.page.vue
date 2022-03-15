<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Heading from '../../components/Heading.vue';
import DataTable from '../../components/DataTable.vue';
import VerovioCanvas from 'vue-verovio-canvas';
import MidiPlayer from '../../components/MidiPlayer.vue';
import ClientOnly from '../../components/ClientOnly.js';
import { useTricinium } from '../../composables/useTricinium';
import TriciniumTextDiff from '../../components/TriciniumTextDiff.vue';

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});
const tricinium = useTricinium(props.tricinium);

const audioDataUrl = ref(null);
</script>

<template>
    <Heading>Tricinium</Heading>
    <DataTable :items="tricinium.lyrics?.map((l, i) => ({'#': i + 1, ...l})) || []"></DataTable>
    <TriciniumTextDiff :tricinium="tricinium" />
    <ClientOnly>
        <MidiPlayer :url="audioDataUrl" />
        <VerovioCanvas :url="tricinium.rawFile" :options="{spacingSystem: 25}" />
    </ClientOnly>
    <pre v-text="tricinium" class="w-full overflow-y-auto"></pre>
</template>
