<script setup>
import { computed, onMounted, ref } from 'vue';
import VerovioCanvas from 'vue-verovio-canvas';
import { useHumdrumScoreFormatter } from '../composables/useHumdrumScoreFormatter';
import InteractiveHumdrumScoreFilterGroup from './InteractiveHumdrumScoreFilterGroup.vue';

const props = defineProps({
    url: {
        type: String,
        required: true,
    },
})

const emit = defineEmits('mounted');

const response = await fetch(props.url);
if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
}

const verovioCanvas = ref(null);
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

onMounted(() => {
    emit('mounted', {
        callVerovioMethod: verovioCanvas.value.callVerovioMethod,
    });
});

function addFilterEvent(filter) {
    addFilter(filter);
}

function removeFilterEvent(filterId) {
    removeFilter(filterId);
}

defineExpose({
    verovioCanvas,
    addFilter,
});
</script>

<template>
    <InteractiveHumdrumScoreFilterGroup :filters="filters" @addFilter="addFilterEvent" @removeFilter="removeFilterEvent" />
    <pre v-text="filtersAsString"></pre>
    <!-- <pre v-text="formattedScoreData"></pre> -->
    <!-- <textarea
        rows="10"
        v-model.lazy="filtersAsString"
        class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
    ></textarea> -->
    <VerovioCanvas ref="verovioCanvas" v-bind="verovioOptions" />
</template>
