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
            svgBoundingBoxes: true,
            svgViewBox: true,
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

async function handleNoteSingleClick(event, target) {
    target = target || event.target;
    const noteElem = target.closest('g.note');
    if (noteElem && callVerovioMethod) {
        emit('noteSelected', noteElem.id, await callVerovioMethod('getMIDIValuesForElement', noteElem.id));
        return;
    }
    const measureElem = target.closest('g.measure');
    if (measureElem) {
        const noteEl = measureElem.querySelector('g.note');
        if (noteEl && callVerovioMethod) {
            emit('noteSelected', noteEl.id, await callVerovioMethod('getMIDIValuesForElement', noteEl.id));
            return;
        }
    }
}

const { openPopup, openFullResourcePopup } = useIiif(data.value, props.iiifManifestUrl);

function handleNoteDoubleClick(event, target, fullResource) {
    target = target || event.target;
    const elem = target.closest('g.note, g.rest, g.mRest');
    if (fullResource || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        openFullResourcePopup(elem, event.metaKey)
    } else {
        openPopup(elem, event.metaKey);
    }
}

let clickCount = 0;
let clickTimeout;

function isTouchDevice() {
    return typeof window !== 'undefined' && (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

function onClickVerovioCanvas(event, target) {
    clickCount++;
    clearTimeout(clickTimeout);

    setTimeout(() => {
        if (clickCount === 1) {
            handleNoteSingleClick(event, target);
        } else if (isTouchDevice() && clickCount === 3) {
            handleNoteDoubleClick(event, target, true);
        } else if (clickCount >= 2) {
            handleNoteDoubleClick(event, target);
        }
        clickCount = 0;
    }, isTouchDevice() ? 750 : 400);
}

function onTouchVerovioCanvas(event, target) {
    event.preventDefault();
    onClickVerovioCanvas(event, target);
}

const scoreWrapper = ref(null);
const scoreContainer = ref(null);
const scoreKey = ref(Date.now());

function mutationObserverEvent() {
    scoreKey.value = Date.now();
    emit('scoreUpdated');
    updateBoundingBoxes()
}

const markerContainer = ref();

function updateBoundingBoxes() {
    markerContainer.value.querySelectorAll('.note-bounding-box').forEach((elem) => elem.remove());
    scoreContainer.value.querySelectorAll('g.note:not(.bounding-box), g.rest:not(.bounding-box), g.mRest:not(.bounding-box)').forEach((elem) => {
        const noteheadRect = getBBoxElem(elem)?.getBoundingClientRect();
        const stemRect = selectBBoxElem(elem, '.stem')?.getBoundingClientRect();
        const flagRect = selectBBoxElem(elem, '.flag')?.getBoundingClientRect();
        const dotsRect = selectBBoxElem(elem, '.dots')?.getBoundingClientRect();
        const accidRect = elem.querySelector('.accid use') && selectBBoxElem(elem, '.accid')?.getBoundingClientRect();
        const rect = elem.getBoundingClientRect();

        let left = Infinity;
        let right = -Infinity;
        let top = Infinity;
        let bottom = -Infinity;
        
        if (noteheadRect) {
            left = Math.min(left, noteheadRect.left);
            right = Math.max(right, noteheadRect.right);
            top = Math.min(top, noteheadRect.top);
            bottom = Math.max(bottom, noteheadRect.bottom);
        }
        if (stemRect) {
            left = Math.min(left, stemRect.left);
            right = Math.max(right, stemRect.right);
            top = Math.min(top, stemRect.top);
            bottom = Math.max(bottom, stemRect.bottom);
        }
        if (flagRect) {
            left = Math.min(left, flagRect.left);
            right = Math.max(right, flagRect.right);
            top = Math.min(top, flagRect.top);
            bottom = Math.max(bottom, flagRect.bottom);
        }
        if (accidRect) {
            left = Math.min(left, accidRect.left);
            right = Math.max(right, accidRect.right);
            top = Math.min(top, accidRect.top);
            bottom = Math.max(bottom, accidRect.bottom);
        }
        if (dotsRect) {
            left = Math.min(left, dotsRect.left);
            right = Math.max(right, dotsRect.right);
            top = Math.min(top, dotsRect.top);
            bottom = Math.max(bottom, dotsRect.bottom);
        }

        left = left === Infinity ? rect.left : left;
        right = right === -Infinity ? rect.right : right; 
        top = top === Infinity ? rect.top : top; 
        bottom = bottom === -Infinity ? rect.bottom : bottom; 

        const sizeExtender = 20;
        const width = right - left + sizeExtender;
        const height = bottom - top + sizeExtender;

        const parentRect = scoreContainer.value.getBoundingClientRect();
        const div = document.createElement('div');
        div.classList.add('note-bounding-box');
        div.style.position = 'absolute';
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        div.style.left = `${left - parentRect.left - sizeExtender / 2}px`;
        div.style.top = `${top - parentRect.top - sizeExtender / 2}px`;
        div.style.cursor = 'pointer';
        div.style.pointerEvents = 'auto';
        div.style.zIndex = 1;
        div.addEventListener('mouseenter', () => elem.classList.add('hover'));
        div.addEventListener('mouseleave', () => elem.classList.remove('hover'));
        div.addEventListener('click', (event) => onClickVerovioCanvas(event, elem));
        div.addEventListener('touchend', (event) => onTouchVerovioCanvas(event, elem));
        markerContainer.value.appendChild(div);
    });
}

onMounted(() => {
    nextTick(() => {
        const mutationObserver = new MutationObserver(mutationObserverEvent);
        if (scoreContainer.value) {
            mutationObserver.observe(scoreContainer.value, {
                // attributes: true,
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
                <div class="absolute w-full h-full top-0 left-0 pointer-events-none overflow-hidden" ref="markerContainer">
                    <slot :scoreWrapper="$refs.scoreWrapper" :key="scoreKey"></slot>
                </div>
                <div ref="scoreContainer" class="verovio-canvas-container">
                    <VerovioCanvas ref="verovioCanvas" v-bind="verovioCanvasOptions" @score-is-ready="verovioCanvasScoreIsReady" />
                </div>
            </div>
        </div>
        <FormattedText>
            <i18n-t v-if="isTouchDevice()" keypath="noteClickHintTouchDevice">

            </i18n-t>
            <i18n-t v-else keypath="noteClickHint" tag="div" class="text-xs text-gray-500">
                <template v-slot:cmd>
                    <kbd>cmd</kbd>
                </template>
                <template v-slot:alt>
                    <kbd>alt</kbd>
                </template>
            </i18n-t>
        </FormattedText>
    </div>
</template>

<style scoped>
.verovio-canvas-container :deep(g.note),
.verovio-canvas-container :deep(g.rest),
.verovio-canvas-container :deep(g.mRest) {
    pointer-events: none;
    cursor: pointer !important;
}

.note-bounding-box {
    cursor: pointer !important;
}

.verovio-canvas-container :deep(g.note:hover),
.verovio-canvas-container :deep(g.note.hover),
.verovio-canvas-container :deep(g.rest:hover),
.verovio-canvas-container :deep(g.rest.hover),
.verovio-canvas-container :deep(g.mRest:hover),
.verovio-canvas-container :deep(g.mRest.hover),
.verovio-canvas-container :deep(g.note:hover path),
.verovio-canvas-container :deep(g.note.hover path) {
    fill: var(--color-primary-500) !important;
    stroke: var(--color-primary-500) !important;
}

.verovio-canvas-container :deep(g.note:hover .verse),
.verovio-canvas-container :deep(g.note.hover .verse) {
    fill: currentColor;
    stroke: currentColor !important;
}
</style>