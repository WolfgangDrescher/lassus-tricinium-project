<script setup>
import { computed, ref, watch } from 'vue';
import DropdownBadge from './DropdownBadge.vue';
import DropdownOption from './DropdownOption.vue';
import { vOnClickOutside } from '@vueuse/components';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    modelValue: {
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
    searchEnabled: {
        type: Boolean,
        default: true,
    },
    emptyValuePlaceholder: {
        type: String,
        default: 'No items selected',
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    badgeShowRemoveButton: {
        type: Boolean,
        default: true,
    },
});

const isOpen = ref(false);
const searchString = ref('');

watch(searchString, () => {
    isOpen.value = true;
});

function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

function closeDropdown() {
    if(!isOpen.value) return;
    isOpen.value = false;
}

function toggleOption(value) {
    if(props.multiple) {
        if(props.modelValue.includes(value)) {
            emit('update:modelValue', props.modelValue.filter(v => v !== value));
        } else {
            emit('update:modelValue', [...props.modelValue, value]);
        }
    } else {
        emit('update:modelValue', value);
    }
};

function removeOption(value) {
    if(props.multiple) {
        emit('update:modelValue', props.modelValue.filter(v => v !== value));
    } else {
        emit('update:modelValue', null);
    }
};

const getOptionTextFromValue = computed(() => {
    return (value) => props.options.find(o => o.value === value)?.text;
});

const optionIsSelected = computed(() => {
    if(props.multiple) {
        return (value) => props.modelValue.includes(value);
    } else {
        return (value) => props.modelValue === value;
    }
});

const filteredOptions = computed(() => {
    if(searchString.value.length && props.searchEnabled) {
        return props.options.filter(o => {
            return o.value.toLowerCase().includes(searchString.value.toLowerCase()) || o.text.toLowerCase().includes(searchString.value.toLowerCase());
        });
    }
    return props.options;
});

</script>

<template>
    <div class="flex flex-col items-center">
        <div class="w-full">
            <div class="flex flex-col items-center relative">
                <div class="w-full">
                    <div class="p-1 flex border border-gray-200 bg-white rounded">
                        <div class="flex flex-auto flex-wrap">
                            <div v-if="!props.modelValue?.length && props.emptyValuePlaceholder" class="p-1 px-2 text-gray-500" v-text="props.emptyValuePlaceholder"></div>
                            <template v-if="props.multiple">
                                <DropdownBadge v-for="(value, index) in props.modelValue" :key="index" :text="getOptionTextFromValue(value)" :value="value" @removeOption="removeOption" :show-remove-button="props.badgeShowRemoveButton" />
                            </template>
                            <DropdownBadge v-else-if="props.modelValue" :text="getOptionTextFromValue(props.modelValue)" :value="props.modelValue" @removeOption="removeOption" :show-remove-button="props.badgeShowRemoveButton" />
                            <div v-if="props.searchEnabled" class="flex-1">
                                <input v-model="searchString" placeholder="" class="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800">
                            </div>
                        </div>
                        <div class="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
                            <button @click="toggleDropdown" class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                                <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="isOpen" v-on-click-outside="closeDropdown" class="absolute shadow border border-gray-200 mt-2 top-full bg-white z-40 w-full lef-0 rounded max-h-80 overflow-y-auto">
                    <div class="flex flex-col w-full">
                        <DropdownOption v-for="(option, index) in filteredOptions" :key="index" :value="option.value" :text="option.text" :selected="optionIsSelected(option.value)" @toggleOption="toggleOption" />
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>
