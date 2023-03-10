<script setup>
const props = defineProps({
    cadences: Array,
});

const highestBeat = Math.max(...(props.cadences || []).map(c => c.beat));
</script>

<template>
    <div class="py-4">
        <div class="h-2 bg-gray-200 rounded-full relative">
            <div v-for="cadence in cadences" :key="cadence._id" class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white w-8 h-8 flex justify-center items-center border-4 border-white" :style="{left: `${cadence.beat / highestBeat * 100}%`}">
                {{ cadence.ultima }}
            </div>
        </div>
    </div>
</template>