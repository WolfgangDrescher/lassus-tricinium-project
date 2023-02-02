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
    initialManualFilters: {
        type: String,
        default: '',
    },
    expertMode: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits([
    'mounted',
    'update:filters',
    'update:expertMode',
    'update:manualFilters',
]);

const expertModeRef = ref(props.expertMode);

const response = await fetch(props.url);
if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: response.statusText });
}

const verovioCanvas = ref(null);
const data = ref(await response.text());

const { formattedScoreData, filtersAsString, manualFilters, filters, addFilter, removeFilter } = useHumdrumScoreFormatter(data, {});

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

manualFilters.value = props.initialManualFilters;

watch(manualFilters, () => {
    emit('update:manualFilters', manualFilters.value);
})

function verovioCanvasMounted(verovioCanvas) {
    emit('mounted', {
        callVerovioMethod: verovioCanvas.callVerovioMethod,
    });
};

function addFilterEvent(filter) {
    addFilter(filter);
    emit('update:filters', toRaw(filters.value));
}

function removeFilterEvent(filterId) {
    removeFilter(filterId);
    emit('update:filters', toRaw(filters.value));
}

function onUpdateManualFilters(value) {
    manualFilters.value = value;
}

function onUpdateExpertMode(value) {
    if (value === false) {
        manualFilters.value = '';
    }
    expertModeRef.value = value;
    emit('update:expertMode', value);
}

defineExpose({
    verovioCanvas,
    addFilter,
});
</script>

<template>
    <div class="flex flex-col gap-4">
        <div>
            <HumdrumFilterGroup
                :filters="filters"
                @addFilter="addFilterEvent"
                @removeFilter="removeFilterEvent"
                :expertMode="expertModeRef"
                @update:expertMode="onUpdateExpertMode"
                :initial-filter-string="initialManualFilters || filtersAsString"
                @update:manualFilters="onUpdateManualFilters"
            />
        </div>
        <div>
            <VerovioCanvas ref="verovioCanvas" v-bind="verovioCanvasOptions" @mounted="verovioCanvasMounted"/>
        </div>
    </div>
</template>
