<script setup>
import { useDrag } from '@vueuse/gesture';

const props = defineProps({
    hide: String,
});

const dragHandle = ref();
const wrapper = ref();
const leftWidth = ref(50);

function calcWidth(x) {
    const value = (x) / wrapper.value.clientWidth * 100;
    return Math.min(75, Math.max(25, value));
}

function dragHandler(dragState) {
    const [x] = dragState.xy;
    leftWidth.value = calcWidth(x);
}

if (!props.hide) {
    useDrag(dragHandler, {
        domTarget: dragHandle,
    });
}
</script>

<template>
    <div class="flex" ref="wrapper">
        <div v-if="hide !== 'left'" class="shrink-0 min-w-0" :class="[!hide && 'grow-0']" :style="{ width: hide ? '100%' : `${leftWidth}%`}">
            <slot name="left"></slot>
        </div>
        <div v-if="!hide" class="shrink-0 grow-0">
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
