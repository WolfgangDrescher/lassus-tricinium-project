<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps(['options'])

const chartRef = ref(null);

onMounted(() => {
    new Chart(chartRef.value, props.options);
});
</script>

<template>
    <div class="aspect-video">
        <canvas ref="chartRef"></canvas>
    </div>
</template>
