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
    'noteSelected',
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

let callVerovioMethod = null;

function verovioCanvasMounted(verovioCanvas) {
    callVerovioMethod = verovioCanvas.callVerovioMethod;
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

async function onClickVerovioCanvas(event) {
    const noteElem = getMatchingParent(event.target, 'g.note')
    if (noteElem) {
        emit('noteSelected', noteElem.id, await callVerovioMethod('getMIDIValuesForElement', noteElem.id));
        return;
    }
    const measureElem = getMatchingParent(event.target, 'g.measure');
    if (measureElem) {
        const noteEl = measureElem.querySelector('g.note');
        if (noteEl) {
            emit('noteSelected', noteEl.id, await callVerovioMethod('getMIDIValuesForElement', noteEl.id));
            return;
        }
    }
}

function getMatchingParent(target, selector) {
    let elem = target;
    while (elem) {
        if (elem.matches && elem.matches(selector)) {
            return elem;
        }
        elem = elem.parentNode;
    }
    return false;
}

const scoreWrapper = ref(null);
const scoreContainer = ref(null);
const scoreKey = ref(Date.now());

function mutationObserverEvent() {
    scoreKey.value = Date.now();
}

onMounted(() => {
    nextTick(() => {
        const mutationObserver = new MutationObserver(mutationObserverEvent);
        if (scoreContainer.value) {
            mutationObserver.observe(scoreContainer.value, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        }
    });
});

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
            <div class="relative" ref="scoreWrapper">
                <div class="absolute w-full h-full top-0 left-0 pointer-events-none">
                    <slot :scoreWrapper="$refs.scoreWrapper" :key="scoreKey"></slot>
                </div>
                <div ref="scoreContainer">
                    <VerovioCanvas ref="verovioCanvas" @click="onClickVerovioCanvas" v-bind="verovioCanvasOptions" @mounted="verovioCanvasMounted"/>
                </div>
            </div>
        </div>
    </div>
</template>
