<script setup>
import { computed, ref } from 'vue';
import VerovioCanvas from 'vue-verovio-canvas';
import { useHumdrumScoreFormatter } from '../composables/useHumdrumScoreFormatter';
import HumdrumScoreAnalyzerFilterGroup from './HumdrumScoreAnalyzerFilterGroup.vue';

const props = defineProps({
    url: {
        type: String,
        required: true,
    },
})

const response = await fetch(props.url);
if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
}
const data = ref(await response.text());

const { formattedScoreData, filtersAsString, filters, addFilter, removeFilter } = useHumdrumScoreFormatter(data, {});

const verovioOptions = computed(() => {
    return {
        options: {
            spacingSystem: 24,
        },
        data: formattedScoreData.value,
    };
});

function addFilterEvent(filter) {
    addFilter(filter);
}

function removeFilterEvent(filterId) {
    removeFilter(filterId);
}
</script>

<template>
    <HumdrumScoreAnalyzerFilterGroup :filters="filters" @addFilter="addFilterEvent" @removeFilter="removeFilterEvent"></HumdrumScoreAnalyzerFilterGroup>
    <pre v-text="filtersAsString"></pre>
    <!-- <pre v-text="formattedScoreData"></pre> -->
    <!-- <textarea
        rows="10"
        v-model.lazy="filtersAsString"
        class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
    ></textarea> -->
    <VerovioCanvas v-bind="verovioOptions" />
</template>
