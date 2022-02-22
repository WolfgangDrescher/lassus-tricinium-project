<script setup>
import { reactive } from 'vue';
import Heading from '../components/Heading.vue';
import meta from 'lassus-geistliche-psalmen/meta.json';
import TriciniumListItem from '../components/TriciniumListItem.vue';
import TriciniumFilter from '../components/TriciniumFilter.vue';
import { useFilter } from '../composables/useFilter.js';

const filter = reactive({
    composer: '',
    title: '',
    nr: '',
});

const { filteredElements } = useFilter(meta, filter);

</script>

<template>
    <Heading>Tricinium Liste</Heading>
    
    <TriciniumFilter :filter="filter" />

    <div class="grid grid-cols-4 gap-4">
        <div v-for="tricinium in filteredElements" :key="tricinium.id">
            <TriciniumListItem :tricinium="tricinium" />
        </div>
    </div>
</template>
