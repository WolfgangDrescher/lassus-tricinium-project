<script setup>
import { defineAsyncComponent } from 'vue';
import Heading from '../../components/Heading.vue';
import DataTable from '../../components/DataTable.vue';
import AsyncVerovioCanvas from '../../components/AsyncVerovioCanvas.vue';
import { useTricinium } from '../../composables/useTricinium';
import { useClientOnly } from '../../composables/useClientOnly';
import TriciniumTextDiff from '../../components/TriciniumTextDiff.vue';

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});
const tricinium = useTricinium(props.tricinium);

const MidiPlayer = defineAsyncComponent(() => import('../../components/MidiPlayer.vue'));
const AsyncMidiPlayer = useClientOnly(MidiPlayer);
</script>

<template>
    <Heading>Tricinium</Heading>
    <DataTable :items="tricinium.lyrics?.map((l, i) => ({'#': i + 1, ...l})) || []"></DataTable>
    <TriciniumTextDiff :tricinium="tricinium" />
    <AsyncVerovioCanvas :url="tricinium.rawFile" :options="{spacingSystem: 25}" />
    <AsyncMidiPlayer :url="audioDataUrl" />
    <pre v-text="tricinium" class="w-full overflow-y-auto"></pre>
</template>
