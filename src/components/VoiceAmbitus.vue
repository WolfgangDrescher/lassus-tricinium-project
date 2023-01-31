<script setup>
import { ModernClefsFilter } from '@/classes/HumdrumFilters.js';

const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
    voice: {
        type: String,
        required: true,
    },
    modernClefs: {
        type: Boolean,
        default: false,
    },
});

const modernClefsFilter = new ModernClefsFilter();

const kern = ref(`**kern
*clef${props.tricinium.getVoiceClef(props.voice)}
1${props.tricinium.getLowestNoteOfVoice(props.voice).kern} 1${props.tricinium.getHighestNoteOfVoice(props.voice).kern}
*-
`);

const { addFilter, removeFilter, formattedScoreData } = useHumdrumScoreFormatter(kern);

if (props.modernClefs) {
    addFilter(modernClefsFilter);
}

watch(() => props.modernClefs, (value) => {
    if(value) {
        addFilter(modernClefsFilter);
    } else {
        removeFilter(modernClefsFilter.id);
    }
});

const lowestNote = props.tricinium.getLowestNoteOfVoice(props.voice);
const highestNote = props.tricinium.getHighestNoteOfVoice(props.voice);
const noteCounts = props.tricinium.getNoteCountOfVoice(props.voice);

const data = [];

for (let keyno = highestNote.keyno; keyno >= lowestNote.keyno; keyno--) {
    const noteCount = noteCounts.find(n => n.keyno === keyno);
    if (noteCount) {
        data.push(noteCount);
    } else {
        data.push({
            keyno,
            count: 0,
            kern: null,
        });
    }
}

const config = {
    type: 'bar',
    data: {
        labels: data.map(n => `${n.keyno}${n.kern ? ` / ${n.kern}` : ''}`),
        datasets: [
            {
                data: data.map(n => n.count),
            },
        ],
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    },
};
</script>

<template>
    <div>
        <div class="flex gap-4">
            <div class="w-1/3 shrink-0 grow-0">
                {{ $t('maxVoiceRange') }}
                <VerovioCanvas :data="formattedScoreData"></VerovioCanvas>
            </div>
            <div class="w-2/3 shrink-0 grow-0">
                <div class="h-64">
                    <Chart :config="config"></Chart>
                </div>
            </div>
        </div>
    </div>
</template>
