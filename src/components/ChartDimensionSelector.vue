<script setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
const { t } = useI18n();

const options = [
    {
        value: 'all',
        text: t('all'),
    },
    {
        value: 'id',
        text: t('id'),
    },
    {
        value: 'title',
        text: t('title'),
    },
    {
        value: 'composer',
        text: t('composer'),
    },
    {
        value: 'mode',
        text: t('mode'),
    },
    {
        value: 'transposition',
        text: t('transposition'),
    },
    {
        value: 'clefs',
        text: t('clefs'),
    },
    {
        value: 'finalis',
        text: t('finalis'),
    },
];

function onChange(value) {
    emit('update:modelValue', value);
}
</script>

<template>
    <div class="grid grid-cols-2 my-4">
        <FormDropdown :options="options" :label="$t('addChartDimension')" :model-value="props.modelValue" @update:modelValue="onChange" />
    </div>
</template>
