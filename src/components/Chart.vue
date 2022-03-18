<script setup>
import { ref, onMounted, watch, toRefs, computed } from 'vue';
import Chart from 'chart.js/auto';


const props = defineProps(['config'])

const { config } = toRefs(props);

let chart = null;
const chartElem = ref(null);

onMounted(() => {
    chart = new Chart(chartElem.value, colorizedConfig.value);
});
</script>

<template>
    <div class="aspect-video">
        <canvas ref="chartElem"></canvas>
    </div>
</template>
