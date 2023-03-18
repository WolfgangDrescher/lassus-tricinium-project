<script setup>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const props = defineProps({
    modelValue: String,
    options: {
        type: Object,
        default: () => ({}),
    },
    growLineRows: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['update:modelValue', 'cursorPositionChanged']);

const containerEl = ref();
const monacoEl = ref();
let editor = null;
let resizeObserver = null;

onMounted(() => {
    nextTick(() => {
        editor = monaco.editor.create(monacoEl.value, Object.assign({
            value: props.modelValue,
            // language: 'typescript',
            scrollBeyondLastLine: false,
            // wordWrap: 'on',
            wrappingStrategy: 'advanced',
            minimap: {
                enabled: false,
            },
            fontSize: 16,
            // readOnly: true,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            theme: 'vs-dark',
        }, props.options));

        if (props.growLineRows) {
            const updateHeight = () => {
                const contentHeight = editor.getContentHeight();
                const contentWidth = containerEl.value.clientWidth;
                monacoEl.value.style.width = `${contentWidth}px`;
                monacoEl.value.style.height = `${contentHeight}px`;
                editor.layout({ width: contentWidth, height: contentHeight });
            };
            editor.onDidContentSizeChange(updateHeight);
            updateHeight();
            resizeObserver = new ResizeObserver(() => {
                updateHeight();
            });
            resizeObserver.observe(containerEl.value);
        }
        editor.getModel().onDidChangeContent(() => emit('update:modelValue', editor.getValue()));
        editor.onDidChangeCursorPosition((event) => {
            const lineContent = editor.getModel().getLineContent(event.position.lineNumber);
            emit('cursorPositionChanged', event, lineContent);
        });
    });
});

onBeforeUnmount(() => {
    resizeObserver?.unobserve(containerEl.value);
});

watch(() => props.modelValue, (value) => {
    if (editor) {
        editor.setValue(value);
    }
});
</script>

<template>
    <div ref="containerEl" :class="{ 'h-full': !growLineRows }">
        <div ref="monacoEl" class="w-full" :class="{ 'h-full': !growLineRows }"></div>
    </div>
</template>
