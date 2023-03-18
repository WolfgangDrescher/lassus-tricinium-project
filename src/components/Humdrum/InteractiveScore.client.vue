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
    iiifManifestUrl: String,
});

const emit = defineEmits([
    'noteSelected',
    'update:filters',
    'update:expertMode',
    'update:manualFilters',
    'scoreUpdated',
    'scoreIsReady',
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

function verovioCanvasScoreIsReady(event) {
    callVerovioMethod = event.callVerovioMethod;
    emit('scoreIsReady', event);
}


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

let preventClick = false;

async function handleNoteSingleClick(event) {
    if (preventClick) return;
    const noteElem = event.target.closest('g.note');
    if (noteElem && callVerovioMethod) {
        emit('noteSelected', noteElem.id, await callVerovioMethod('getMIDIValuesForElement', noteElem.id));
        return;
    }
    const measureElem = event.target.closest('g.measure');
    if (measureElem) {
        const noteEl = measureElem.querySelector('g.note');
        if (noteEl && callVerovioMethod) {
            emit('noteSelected', noteEl.id, await callVerovioMethod('getMIDIValuesForElement', noteEl.id));
            return;
        }
    }
}

const { openPopup, openFullResourcePopup } = useIiif(data.value, props.iiifManifestUrl);

function handleNoteDoubleClick(event) {
    const target = event.target.closest('g.note, g.rest, g.mRest');
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        openFullResourcePopup(target)
    } else {
        openPopup(target);
    }
}

function onClickVerovioCanvas(event) {
    if (event.detail === 1) {
        setTimeout(() => {
            handleNoteSingleClick(event);
            preventClick = false;
        }, 200);
    }
    if (event.detail > 1) {
        preventClick = true;
        handleNoteDoubleClick(event);
        return;
    }
    
}

const scoreWrapper = ref(null);
const scoreContainer = ref(null);
const scoreKey = ref(Date.now());

function mutationObserverEvent() {
    scoreKey.value = Date.now();
    emit('scoreUpdated');
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
                <div ref="scoreContainer" class="verovio-canvas-container">
                    <VerovioCanvas ref="verovioCanvas" @click="onClickVerovioCanvas" v-bind="verovioCanvasOptions" @score-is-ready="verovioCanvasScoreIsReady" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.verovio-canvas-container :deep(g.note),
.verovio-canvas-container :deep(g.rest),
.verovio-canvas-container :deep(g.mRest) {
    pointer-events: bounding-box;
    cursor: pointer !important;
}

.verovio-canvas-container :deep(g.note:hover),
.verovio-canvas-container :deep(g.rest:hover),
.verovio-canvas-container :deep(g.mRest:hover),
.verovio-canvas-container :deep(g.note:hover path) {
    fill: var(--color-primary-500) !important;
    stroke: var(--color-primary-500) !important;
}

.verovio-canvas-container :deep(g.note:hover .verse) {
    fill: currentColor;
    stroke: currentColor !important;
}
</style>