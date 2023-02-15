<script setup>
const { t } = useI18n();
const props = defineProps({
    mint: String,
    items: Array,
});

const data = computed(() => {
    return Object.entries(props.items.reduce((accumulator, value) => {
        accumulator[value.next] = typeof (accumulator[value.next]) === 'number' ? accumulator[value.next] + 1 : 1;
        return accumulator;
    }, {})).map(([key, value]) => ({
        x: key,
        y: value,
    })).sort((a, b) => {
        return b.y - a.y;
    });
});

const config = computed(() => ({
    type: 'bar',
    data: {
        datasets: [
            {
                label: t('nextMelodicInterval'),
                data: data.value,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                // display: false,
                onClick: () => {},
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    },
}));

const maxItems = 50;
</script>

<template>
    <Card :title="mint">
        <template #title>
            <div class="flex justify-between items-center">
                <div class="text-xl font-medium leading-5 text-gray-800">
                    {{ mint }}
                </div>
                <div>
                    {{ $t('totalNumber', items.length) }}
                </div>
            </div>
        </template>
        <div class="aspect-w-4 aspect-h-1">
            <Chart :config="config" />
        </div>
        <div class="mt-4">
            <Subheading>{{ $t('melodicIntervalExamples') }}</Subheading>
            <div class="text-sm text-gray-500">{{ $t('triciniumSpineLineIndex', maxItems) }}</div>
            <div class="flex flex-wrap gap-x-2">
                <HyperLink v-for="item in items.splice(0, maxItems)" target="_blank" :to="`https://verovio.humdrum.org/?file=https://raw.githubusercontent.com/WolfgangDrescher/lassus-geistliche-psalmen/master/kern/${item.triciniumId}.krn`">
                    {{ `${parseInt(item.triciniumId.substring(0, 2), 10)}/${item.spine}/${item.lineIndex + 1}` }}
                </HyperLink>
            </div>
        </div>
    </Card>
</template>