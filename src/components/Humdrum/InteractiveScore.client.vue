<script setup>
const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    verovioOptions: {
        type: Object,
        default: () => ({}),
    },
    initialFilters: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['mounted', 'filtersChanged']);

const response = await fetch(props.url);
if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
}

const verovioCanvas = ref(null);
const data = ref(await response.text());

const { formattedScoreData, filtersAsString, filters, addFilter, removeFilter } = useHumdrumScoreFormatter(data, {});

const verovioCanvasOptions = computed(() => {
    return Object.assign({
        pageMargin: 50,
        options: {
            ...props.verovioOptions,
        },
        data: formattedScoreData.value,
    });
});

if (props.initialFilters) {
    props.initialFilters.forEach(filter => {
        addFilter(filter);
    });
}

function verovioCanvasMounted(verovioCanvas) {
    emit('mounted', {
        callVerovioMethod: verovioCanvas.callVerovioMethod,
    });
};

function addFilterEvent(filter) {
    addFilter(filter);
    emit('filtersChanged', toRaw(filters.value));
}

function removeFilterEvent(filterId) {
    removeFilter(filterId);
    emit('filtersChanged', toRaw(filters.value));
}

defineExpose({
    verovioCanvas,
    addFilter,
});
</script>

<template>
    <HumdrumFilterGroup :filters="filters" @addFilter="addFilterEvent" @removeFilter="removeFilterEvent" />
    <div class="overflow-x-hidden">
        <pre v-text="filtersAsString"></pre>
    </div>
    <!-- <pre v-text="formattedScoreData"></pre> -->
    <!-- <textarea
        rows="10"
        v-model.lazy="filtersAsString"
        class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
    ></textarea> -->
    <VerovioCanvas ref="verovioCanvas" v-bind="verovioCanvasOptions" @mounted="verovioCanvasMounted"/>
</template>
