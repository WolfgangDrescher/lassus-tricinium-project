<script setup>
const props = defineProps({
    cadence: {
        type: Object,
        required: true,
    },
});

const { tricinium } = props.cadence;

const { t } = useI18n();

const tableHeaders = [
    {
        value: 'ultima',
        text: t('ultima'),
    },
    {
        value: 'degree',
        text: t('degree'),
    },
];

const tableItems = [
    {
        ultima: props.cadence.ultima,
        degree: romanize(props.cadence.degree),
    },
]
</script>

<template>
    <div class="p-6 shadow border border-gray-100 rounded">
        <div class="flex items-center border-b border-gray-200 pb-6">
            <div class="w-32 h-12 flex justify-center items-center font-serif text-4xl">
                {{ `${tricinium.nr}/${cadence.startLine}` }}
            </div>
            <div class="flex items-start justify-between w-full">
                <div class="pl-3 w-full">
                    <div class="text-xl font-medium leading-5 text-gray-800">
                        <NuxtLink :href="`/tricinium/${tricinium.id}`">
                            {{ `${tricinium.nr}. ${tricinium.title}, ${$t('line')} ${cadence.startLine}-${cadence.endLine}` }}
                        </NuxtLink>
                    </div>
                    <div class="text-sm leading-normal pt-1 text-gray-500">
                        {{ tricinium.composer }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-4 mt-4">
            <ClientOnly>
                <VerovioCanvas :url="`/cadences/${cadence.filename}`" view-mode="horizontal" :scale="35" lazy />
            </ClientOnly>
            <DataTable :items="tableItems" :headers="tableHeaders" direction="column" small />
        </div>
    </div>
</template>
