<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

const props = defineProps({
    mint: String,
    items: Array,
});

function filterData(filterFn) {
    return Object.entries(props.items.filter(i => typeof filterFn === 'function' ? filterFn(i) : true).reduce((accumulator, value) => {
        accumulator[value.next] = typeof (accumulator[value.next]) === 'number' ? accumulator[value.next] + 1 : 1;
        return accumulator;
    }, {})).map(([key, value]) => ({
        x: key,
        y: value,
    })).sort((a, b) => {
        return b.y - a.y;
    });
}

const dataUp = computed(() => {
    return filterData(item => {
        return item.next?.startsWith('+') || item.next?.match(/^[A]+1$/);
    });
});

const dataDown = computed(() => {
    return filterData(item => {
        return item.next?.startsWith('-') || item.next?.match(/^[d]+1$/);
    });
});

const dataNone = computed(() => {
    return filterData(item => {
        return item.next === 'r' || item.next === null || item.next?.match(/^[P]+1$/);
    });
});

const config = computed(() => ({
    type: 'bar',
    data: {
        labels: filterData().map(v => v.x),
        datasets: [
            {
                label: t('mint.up'),
                data: dataUp.value,
            },
            {
                label: t('mint.down'),
                data: dataDown.value,
            },
                        {
                label: t('mint.none'),
                data: dataNone.value,
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
                // onClick: () => {},
            },
        },
        scales: {
            x: {
                stacked: true,
            },
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
        <Subheading>{{ $t('nextMelodicInterval') }}</Subheading>
        <div class="aspect-w-4 aspect-h-1">
            <Chart :config="config" />
        </div>
        <div class="mt-4">
            <Subheading>{{ $t('melodicIntervalExamples') }}</Subheading>
            <div class="text-sm text-gray-500">{{ $t('triciniumLineIndexSpine', maxItems) }}</div>
            <div class="flex flex-wrap gap-x-2">
                <HyperLink v-for="item in items.splice(0, maxItems)" target="_blank" :to="localePath({ name: 'tricinium-id', hash: `#note-L${item.lineIndex + 1}F${item.spine}`, params: { id: item.triciniumId } })">    
                    {{ `${parseInt(item.triciniumId.substring(0, 2), 10)}/${item.lineIndex + 1}/${item.spine}` }}
                </HyperLink>
            </div>
        </div>
    </Card>
</template>