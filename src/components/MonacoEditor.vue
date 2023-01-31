<script setup>
import { propsToAttrMap } from '@vue/shared';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const containerEl = ref();
const monacoEl = ref();
let editor = null;

onMounted(() => {
    editor = monaco.editor.create(monacoEl.value, {
        value: props.modelValue,
        // language: 'typescript',
        scrollBeyondLastLine: false,
        // wordWrap: 'on',
        wrappingStrategy: 'advanced',
        minimap: {
            enabled: false
        },
        fontSize: 16,
        // readOnly: true,
        hideCursorInOverviewRuler: true,
        overviewRulerLanes: 0,
        theme: 'vs-dark',
    });

    const updateHeight = () => {
        const contentHeight = editor.getContentHeight();
        const contentWidth = containerEl.value.clientWidth;
        monacoEl.value.style.width = `${contentWidth}px`;
        monacoEl.value.style.height = `${contentHeight}px`;
        editor.layout({ width: contentWidth, height: contentHeight });
    };
    editor.onDidContentSizeChange(updateHeight);
    updateHeight();
    editor.getModel().onDidChangeContent(() => emit('update:modelValue', editor.getValue()));
    const resizeObserver = new ResizeObserver(() => {
        updateHeight();
    });
    resizeObserver.observe(containerEl.value);
});

watch(() => props.modelValue, (value) => {
    if (editor) {
        editor.setValue(value);
    }
});
</script>

<template>
    <div ref="containerEl">
        <div ref="monacoEl" class="w-full"></div>
    </div>
</template>
