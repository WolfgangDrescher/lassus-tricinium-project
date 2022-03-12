<script setup>
import { reactive } from 'vue';
import Heading from '../../components/Heading.vue';
import meta from 'lassus-geistliche-psalmen/meta.json';
import TriciniumListItem from '../../components/TriciniumListItem.vue';
import TriciniumFilter from '../../components/TriciniumFilter.vue';
import { useFilter } from '../../composables/useFilter.js';
import { useTricinium } from '../../composables/useTricinium';

const filter = reactive({
    composer: '',
    title: '',
    nr: '',
});

const { filteredElements } = useFilter(useTricinium(meta), filter);
</script>

<template>
    <Heading>Tricinium Liste</Heading>

    <TriciniumFilter :filter="filter" />

    <div class="grid grid-cols-2 gap-4">
        <div v-for="tricinium in filteredElements" :key="tricinium.id">
            <TriciniumListItem :tricinium="tricinium" />
        </div>
    </div>
</template>
