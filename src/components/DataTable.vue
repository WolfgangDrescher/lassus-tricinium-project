<script setup>
import { computed } from 'vue';

const props = defineProps({
    headers: {
        type: Array,
    },
    items: {
        type: Array,
        required: true,
    },
});

const fields = computed(() => {
    if (props.headers && props.headers.length) {
        return props.headers;
    }
    return props.items.length ? Object.entries(props.items[0]).map(([key, value]) => {
        return {
            value: key,
            text: key.charAt(0).toUpperCase() + key.slice(1),
        };
    }) : [];
});
</script>

<template>
    <div class="flex flex-col">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 sm:rounded">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th v-for="(field, i) in fields" :key="i" scope="col" class="py-3 px-6 text-left border-b border-gray-200">
                                    {{ field.text }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, j) in items" :key="j" class="bg-white border-b border-gray-200">
                                <td v-for="(field, k) in fields" :key="k" class="py-4 px-6 whitespace-nowrap">
                                    <slot :name="`item.${field.value}`" :item="item">
                                        <span v-text="item[field.value]"></span>
                                    </slot>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
