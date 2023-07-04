<script setup>
import { ModernClefsFilter, IntervallsatzPresetFilter, HideLyricsFilter } from '@/classes/HumdrumFilters.js';

const props = defineProps({
    cambiata: Object,
    caption: String,
    showModernClefs: Boolean,
    showIntervallsatz: Boolean,
    hideLyrics: Boolean,
});

const { cambiata } = props;
const { showModernClefs, showIntervallsatz, hideLyrics } = toRefs(props);

const localePath = useLocalePath();

const data = ref(null);

onMounted(async () => {
    const response = await fetch(`/cambiata/${cambiata.filename}`);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    data.value = await response.text();
});

const modernClefsFilter = new ModernClefsFilter();
const showIntervallsatzFilter = new IntervallsatzPresetFilter();
const hideLyricsFilter = new HideLyricsFilter();

const { addFilter, removeFilter, formattedScoreData } = useHumdrumScoreFormatter(data);

if (showModernClefs.value) {
    addFilter(modernClefsFilter);
}

if (showIntervallsatz.value) {
    addFilter(showIntervallsatzFilter);
}

if (hideLyrics.value) {
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

watch(hideLyrics, (value) => {
    if (value) {
        addFilter(hideLyricsFilter);
    } else {
        removeFilter(hideLyricsFilter.id);
    }
});

</script>

<template>
    <div>
        <div class="cursor-pointer" @click="navigateTo(localePath({ name: 'tricinium-id', params: { id: cambiata.triciniumId } }))">
            <VerovioCanvas :data="formattedScoreData" :scale="35" :key="formattedScoreData" />
        </div>
        <div v-if="caption" class="mt-2 text-center">
            <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: cambiata.triciniumId } })">
                {{ caption }}
            </NuxtLink>
        </div>
    </div>
</template>