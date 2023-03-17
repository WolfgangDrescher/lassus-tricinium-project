<script setup>
const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

useHead({
    title: `${t('melodicIntervals')} | ${t('statistics')}`,
});

const { data } = await useFetch('/api/tricinium');
const { data: mint } = await useAsyncData('mint', () => queryContent('/mint').findOne());
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/intervallschritte',
    },
});

const { filteredElements } = useTriciniumFilter(tricinia);

function sortFn(a, b) {
    const sortingArr = ['d', 'm', 'M', 'P', 'A'];
    const aNum = parseInt(a.replace(/\D+/g, ''), 10);
    const bNum = parseInt(b.replace(/\D+/g, ''), 10);
    if (aNum > bNum) {
        return 1;
    }
    if (aNum < bNum) {
        return -1;
    }
    const aQuality = a.replace(/\d+|\-|\+/g, '');
    const bQuality = b.replace(/\d+|\-|\+/g, '');
    return sortingArr.indexOf(aQuality) - sortingArr.indexOf(bQuality);
}

const mintIntervals = Object.entries(toRaw(mint.value)).filter(([key]) => {
    return key.startsWith('+') || key.startsWith('-') || key.match(/^[APd]+1$/);
}).reduce((accumulator, [key, value]) => {
    accumulator[key] = value;
    return accumulator;
}, {});


const labels = Object.entries(mintIntervals).map(([key]) => key).reduce((accumulator, value) => {
    const mint = value.replace('+', '').replace('-', '');
    if (!accumulator.includes(mint)) {
        accumulator.push(mint);
    }
    return accumulator;
}, []).sort(sortFn);

const datasets = computed(() => {
    const dataUp = [];
    const dataDown = [];
    const dataNone = [];
    Object.entries(mintIntervals).forEach(([key, value]) => {
        if (key.startsWith('+') || key.match(/^[A]+1$/)) {
            dataUp.push({
                x: key.replace('+', ''),
                y: value.filter(interval => {
                    return filteredElements.value.map(tricinium => tricinium.id).includes(interval.triciniumId);
                }).length,
            });
        }
        if (key.startsWith('-') || key.match(/^[d]+1$/)) {
            dataDown.push({
                x: key.replace('-', ''),
                y: -value.filter(interval => {
                    return filteredElements.value.map(tricinium => tricinium.id).includes(interval.triciniumId);
                }).length,
            });
        }
        if (key.match(/^[P]+1$/)) {
            dataNone.push({
                x: key,
                y: value.filter(interval => {
                    return filteredElements.value.map(tricinium => tricinium.id).includes(interval.triciniumId);
                }).length,
            });
        }
    });
    dataUp.sort((a, b) => sortFn(a.x, b.x));
    dataDown.sort((a, b) => sortFn(a.x, b.x));
    dataNone.sort((a, b) => sortFn(a.x, b.x));
    return [
        {
            label: t('mint.up'),
            data: dataUp,
        },
        {
            label: t('mint.down'),
            data: dataDown,
        },
        {
            label: t('mint.none'),
            data: dataNone,
        },
    ];
});

const config = computed(() => ({
    type: 'bar',
    data: {
        labels,
        datasets: datasets.value,
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
            // legend: {
            //     display: !!dimension.value,
            // },
            tooltip: {
                intersect: false,
                callbacks: {
                    label: (c) => {
                        const value = Number(c.raw.y);
                        const positiveOnly = value < 0 ? -value : value;
                        return`${c.dataset.label}: ${positiveOnly}`;
                    },
                },
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
                    callback: (v) => {
                        return v < 0 ? -v : v;
                    },
                },
            },
        },
    },
}));

const mintItem = computed(() => {
    return (key) => {
        return mintIntervals[key].filter(item => {
            return filteredElements.value.map(tricinium => tricinium.id).includes(item.triciniumId);
        });
    };
});

const selectedMint = ref(null);
</script>

<template>
    <div>
        <Heading>{{ $t('melodicIntervals')}}</Heading>
        <TriciniumFilter />
        <!-- <ChartDimensionSelector v-model="dimension" /> -->
        <div class="my-4">
            {{ $t('nOutOfTotalTriciniaFoundForSerachParams', { n: filteredElements.length, total: tricinia.length }) }}
        </div>
        <div class="aspect-w-16 aspect-h-9">
            <Chart :config="config" />
        </div>
        <div class="my-4">
            <BadgeGroup>
                <Badge v-for="interval in Object.entries(mintIntervals).map(([key]) => key).sort(sortFn)" :key="interval" class="cursor-pointer" @click="selectedMint = selectedMint === interval ? null : interval" :selected="selectedMint === interval">{{ interval }}</Badge>
            </BadgeGroup>
            <div class="flex flex-col gap-4 mt-4">
                <MintItem class="grow-0" v-for="interval in Object.entries(mintIntervals).map(([key]) => key).sort(sortFn).filter(mint => !selectedMint || selectedMint === mint)" :key="`${interval}${filteredElements.map(tricinium => tricinium.id).join()}`" :mint="interval" :items="mintItem(interval)" />
            </div>
        </div>
    </div>
</template>
