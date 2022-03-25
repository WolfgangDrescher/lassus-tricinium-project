<script setup>
import Heading from '../../components/Heading.vue';
import TriciniumListItem from '../../components/TriciniumListItem.vue';
import TriciniumFilter from '../../components/TriciniumFilter.vue';
import { useTriciniumFilter } from '../../composables/useTriciniumFilter.js';
import { useTricinium } from '../../composables/useTricinium';
import Container from '../../components/Container.vue';

const props = defineProps({
    tricinia: {
        type: Array,
        required: true,
    },
});

const tricinia = useTricinium(props.tricinia);

const { filteredElements } = useTriciniumFilter(tricinia);
</script>

<template>
    <Container>
        <Heading>Tricinium Liste</Heading>

        <TriciniumFilter />

        <div class="grid grid-cols-2 gap-4">
            <div v-for="tricinium in filteredElements" :key="tricinium.id">
                <TriciniumListItem :tricinium="tricinium" />
            </div>
        </div>
    </Container>
</template>
