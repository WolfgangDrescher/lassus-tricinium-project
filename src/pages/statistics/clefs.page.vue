<script setup>
import StatisticsIndexPage from './index.page.vue';
import Heading from '../../components/Heading.vue';

const props = defineProps(['tricinia']);
</script>

<template>
    <StatisticsIndexPage>
        <Heading>Clef statistics</Heading>
        <pre v-text="tricinia"></pre>
    </StatisticsIndexPage>
</template>
