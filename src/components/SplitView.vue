<script setup>
import { useDrag } from '@vueuse/gesture';

const props = defineProps({
    hide: String,
    initialWidth: 50,
});

const emit = defineEmits(['update:width']);

const dragHandle = ref();
const wrapper = ref();
const leftWidth = ref(props.initialWidth);

function calcWidth(x) {
    let value = (x) / wrapper.value.clientWidth * 100;
    if (value >= 47 && value <= 53) {
        value = 50;
    }
    return Math.min(75, Math.max(25, value));
}

function dragHandler(dragState) {
    const [x] = dragState.xy;
    leftWidth.value = calcWidth(x);
    emit('update:width', leftWidth.value);
}

if (!props.hide) {
    useDrag(dragHandler, {
        domTarget: dragHandle,
    });
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-4 md:gap-0" ref="wrapper">
        <div v-if="hide !== 'left'" class="left-side shrink-0 min-w-0" :class="[!hide && 'grow-0']" :style="`--width: ${hide ? 100 : leftWidth}%;`">
            <slot name="left"></slot>
        </div>
        <div v-if="!hide" class="shrink-0 grow-0 hidden md:block">
            <div class="px-2 h-full group/separator">
                <div class="cursor-ew-resize px-1 h-full hover:bg-red-50" ref="dragHandle">
                    <div class="h-full w-[2px] group-hover/separator:bg-gray-300"></div>
                </div>
            </div>
        </div>
        <div v-if="hide !== 'right'" class="shrink grow min-w-0">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<style scoped>
@screen md {
    .left-side {
        width: var(--width);
    }
}
</style>
