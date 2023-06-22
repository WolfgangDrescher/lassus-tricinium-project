<script setup>
const { t } = useI18n();

const props = defineProps({
    melisma: {
        type: Object,
        required: true,
    },
});

const { tricinium } = props.melisma;

const data = ref(null);

onMounted(async () => {
    const response = await fetch(`/melisma/${props.melisma.filename}`);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    data.value = await response.text();
});

const location = `${t(`voice.${props.melisma.voice}`)}, T. ${Math.ceil(props.melisma.startBeat / 8)} ♩ ${(props.melisma.startBeat % 8) + 1}`;
</script>

<template>
    <Card :title="location" borderless>
        <template v-slot:title>
            <div class="flex items-center">
                <div class="flex items-start justify-between w-full">
                    <div class="w-full">
                        <div class="text-xl font-medium leading-5 text-gray-800">
                            <NuxtLink :href="`/tricinium/${tricinium.id}`">
                                {{ `${tricinium.nr}. ${tricinium.title}, ${location}` }}
                            </NuxtLink>
                        </div>
                        <div class="text-sm leading-normal pt-1 text-gray-500">
                            {{ tricinium.composer }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="flex flex-col gap-4 mt-4">
            <VerovioCanvas v-if="data" :data="data" view-mode="horizontal" :scale="35" lazy unload :lazy-delay="100" :options="{ mnumInterval: 1 }" />
        </div>
    </Card>
</template>
