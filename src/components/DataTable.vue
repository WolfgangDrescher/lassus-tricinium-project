<script setup>
const props = defineProps({
    headers: {
        type: Array,
    },
    items: {
        type: Array,
        required: true,
    },
    showHead: {
        type: Boolean,
        default: true,
    },
    direction: {
        type: String,
        default: 'row',
    },
    small: {
        type: Boolean,
        default: false,
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

// text-left text-center text-right
</script>

<template>
    <div class="flex flex-col overflow-x-hidden">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 sm:rounded">
                    <table class="min-w-full">
                        <template v-if="direction === 'row'">
                            <thead class="bg-gray-50" v-if="showHead">
                                <tr>
                                    <th v-for="(field, i) in fields" :key="i" scope="col" class="border-b border-gray-200" :class="[small ? 'py-2 px-3' : 'py-4 px-6', `text-${field.align ?? 'left'}`]">
                                    <slot :name="`head.${field.value}`" :field="field">
                                        {{ field.text }}
                                    </slot>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, j) in items" :key="j" class="bg-white border-b border-gray-200">
                                    <td v-for="(field, k) in fields" :key="k" class="whitespace-nowrap" :class="small ? 'py-2 px-3 ' : 'py-4 px-6'">
                                        <slot :name="`item.${field.value}`" :item="item">
                                            <span v-text="item[field.value]"></span>
                                        </slot>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                        <template v-else>
                            <tbody>
                                <tr v-for="(field, j) in fields" :key="j" class="bg-white border-b border-gray-200">
                                    <th v-if="showHead" class="border-b border-gray-200 w-1" :class="[small ? 'py-2 px-3 ' : 'py-4 px-6', `text-${field.align ?? 'left'}`]">
                                    <slot :name="`head.${field.value}`" :field="field">
                                        {{ field.text }}
                                    </slot>
                                    </th>
                                    <td v-for="(item, k) in items" :key="k" class="whitespace-nowrap" :class="small ? 'py-2 px-3 ' : 'py-4 px-6'">
                                        <slot :name="`item.${field.value}`" :item="item">
                                            <span v-text="item[field.value]"></span>
                                        </slot>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
