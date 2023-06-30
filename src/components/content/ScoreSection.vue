<script setup>
const props = defineProps({
    id: String,
    filters: Array,
    caption: String,
});

const localePath = useLocalePath();

const kern = ref();

const kernWithFilters = computed(() => {
    console.log(props.filters);
    const filtersString = props.filters.map(filter => `!!!filter: ${filter}`).join('\n');
    return kern.value ? `${kern.value}\n${filtersString}` : '';
});

onMounted(() => {
    fetch(`/lassus-geistliche-psalmen/${props.id}.krn`).then(response => {
        return response.text();
    }).then(value => {
        kern.value = value;
    });
});
</script>

<template>
    <div class="flex justify-center">
        <div>
            <div @click="navigateTo(localePath({ name: 'tricinium-id', params: { id } }))" class="cursor-pointer">
                <VerovioCanvas :data="kernWithFilters" />
            </div>
            <div v-if="caption" class="flex justify-center mt-2 italic">
                <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id } })">
                    {{ caption }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>