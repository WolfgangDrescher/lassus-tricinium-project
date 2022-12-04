<script setup>
const { t } = useI18n();
const { data } = await useFetch('/api/tricinium');
const tricinia = useTricinium(data.value);
const { filteredElements } = useTriciniumFilter(tricinia);

const scoreDisplay = ref('lassus');
const showLyrics = ref(true);

const scoreOptions = [
    {
        value: 'lassus',
        text: 'Lassus',
    },
    {
        value: 'ulenberg',
        text: 'Ulenberg',
    },
    {
        value: 'none',
        text: t('none'),
    },
];
</script>

<template>
    <Container>
        <Heading>{{ $t('tricinia') }}</Heading>

        <TriciniumFilter />

        <div class="my-4 flex">
            <div class="flex items-center">
                {{ $t('nTriciniaFoundForSerachParams', filteredElements.length) }}
            </div>
            <div class="ml-auto flex gap-4 items-center">
                <div>
                    <label>
                        <input type="checkbox" v-model="showLyrics" />
                        {{ $t('showLyrics') }}
                    </label>
                </div>
                <div class="w-28">
                    <FormDropdown v-model="scoreDisplay" :search-enabled="false" :options="scoreOptions" :badge-show-remove-button="false"></FormDropdown>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div v-for="tricinium in filteredElements" :key="tricinium.id">
                <TriciniumListItem :tricinium="tricinium" :score-display="scoreDisplay" :show-lyrics="showLyrics" />
            </div>
        </div>
    </Container>
</template>
