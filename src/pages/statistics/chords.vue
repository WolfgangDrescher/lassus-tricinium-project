<script setup>
const { t } = useI18n();

definePageMeta({
    layout: 'statistics',
});

useHead({
    title: `${t('chords')} | ${t('statistics')}`,
});

const { data: chordsData } = await useAsyncData(`chords`, () => queryContent(`/chords`).find())

const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);

defineI18nRoute({
    paths: {
        de: '/statistiken/akkorde',
    },
});

const filterOptions = reactive({
    numberOfNotesInChord: null,
    ignoreDissonances: false,
});

const { filteredElements } = useTriciniumFilter(tricinia);

const config = computed(() => {
    return createSliceIntervalsChartConfig(chordsData.value, filteredElements);
});

function createSliceIntervalsChartConfig(data, filteredElements) {
    data = Array.isArray(data) ? data : [data];

    const chordItems = {};

    data.forEach(item => {
        const intervalsCount = Object.entries(item).filter(([chord]) => !chord.startsWith('_') && chord !== 'title');
        for (const [key, value] of intervalsCount) {
            if (filterOptions.numberOfNotesInChord === '3' && key.split(' ').length === 3) {
                continue;
            }
            if (filterOptions.numberOfNotesInChord === '2' && key.split(' ').length === 2) {
                continue;
            }
            if (filterOptions.ignoreDissonances && ['2', '4', '7', '9'].some(el => key.includes(el))) {
                continue;
            }
            chordItems[key] = chordItems[key] ?? 0;
            if (filteredElements.value.map(t => t.id).includes(/[^/]*$/.exec(item._path)[0])) {
                chordItems[key] += value;
            }
        }
    });

    const dataItems = [];

    for (const [key, value] of Object.entries(chordItems)) {
        if (value > 0) {
            dataItems.push({
                key,
                value,
            });
        }
    }

    dataItems.sort((a, b) => b.value - a.value);

    return {
        type: 'bar',
        data: {
            labels: dataItems.map(i => i.key).map(c => `${c}`.split(' ').map(e => e.trim()).join(', ')),
            datasets: [
                {
                    data: dataItems.map(i => i.value),
                },
            ],
        },
        options: {
            // indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    intersect: false,
                    callbacks: {
                        // label: (c) => ;,
                    }
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
    };
};
</script>

<template>
    <div>
        <Heading>{{ $t('chords')}}</Heading>
        <TriciniumFilter />
        <div class="my-4">
            {{ $t('nOutOfTotalTriciniaFoundForSerachParams', { n: filteredElements.length, total: tricinia.length }) }}
        </div>
        <div class="grid md:grid-cols-3 gap-2 mb-2">
            <div>
                <FormDropdown v-model="filterOptions.numberOfNotesInChord" :label="$t('numberOfNotesInChord')" group-label="" :options="[
                    { value: '2', text: 2},
                    { value: '3', text: 3},
                ]" :search-enabled="false" :multiple="false"/>
            </div>
            <div>
                <FormCheckbox v-model="filterOptions.ignoreDissonances" :label="$t('ignoreDissonances')" group-label="" />
            </div>
        </div>
        <div class="aspect-w-16 aspect-h-9">
            <Chart :config="config" :key="config" />
        </div>
    </div>
</template>
