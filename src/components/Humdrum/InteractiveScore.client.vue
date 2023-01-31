<script setup>
import '@/workers/monaco.js';
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
    <div class="flex flex-col gap-4">
        <div>
            <HumdrumFilterGroup :filters="filters" @addFilter="addFilterEvent" @removeFilter="removeFilterEvent" />
        </div>
        <div>
            <MonacoEditor v-model="filtersAsString" />
        </div>
        <div>
            <VerovioCanvas ref="verovioCanvas" v-bind="verovioCanvasOptions" @mounted="verovioCanvasMounted"/>
        </div>
    </div>
</template>
