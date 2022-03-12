<script setup>
import { reactive } from 'vue';
import Heading from '../../components/Heading.vue';
import TriciniumListItem from '../../components/TriciniumListItem.vue';
import TriciniumFilter from '../../components/TriciniumFilter.vue';
import { useFilter } from '../../composables/useFilter.js';
import { useTricinium } from '../../composables/useTricinium';

const props = defineProps({
    tricinia: {
        type: Array,
        required: true,
    },
});

const tricinia = useTricinium(props.tricinia);

const filter = reactive({
    composer: '',
    title: '',
    nr: '',
});

const { filteredElements } = useFilter(tricinia, filter);
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
