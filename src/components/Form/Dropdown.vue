<script setup>
import { onClickOutside } from '@vueuse/core';

const emit = defineEmits(['update:modelValue']);
const { t } = useI18n();

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
        default: null,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    badgeShowRemoveButton: {
        type: Boolean,
        default: true,
    },
    closeOnChange: {
        type: Boolean,
        default: false,
    },
});

const emptyValuePlaceholderText = computed(() => {
    return props.emptyValuePlaceholder || t('noItemsSelected');
});

const dropdownOptions = ref();

function hasParentWithMatchingSelector(target, selector) {
    const myArray = Array.from(document.querySelectorAll(selector));
    return [...myArray].some(el => el !== target && el.contains(target));
}

onClickOutside(dropdownOptions, (event) => {
    if (hasParentWithMatchingSelector(event.target, '[data-dropdown-button]')) {
        event.stopPropagation();
    }
    closeDropdown();
});

const isOpen = ref(false);
const searchString = ref('');

watch(searchString, (value) => {
    if (value) {
        isOpen.value = true;
    }
});

function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

function closeDropdown() {
    if (!isOpen.value) return;
    isOpen.value = false;
    searchString.value = '';
}

function openDropdown() {
    if (isOpen.value) return;
    isOpen.value = true;
}

function toggleOption(value, event) {
    event.stopPropagation();
    if (props.multiple) {
        if (props.modelValue.includes(value)) {
            emit('update:modelValue', props.modelValue.filter(v => v !== value));
        } else {
            emit('update:modelValue', [...props.modelValue, value]);
        }
    } else {
        emit('update:modelValue', value);
    }
    if(props.closeOnChange) {
        closeDropdown();
    }
}

function removeOption(value) {
    if (props.multiple) {
        emit('update:modelValue', props.modelValue.filter(v => v !== value));
    } else {
        emit('update:modelValue', null);
    }
}

const getOptionTextFromValue = computed(() => {
    return value => props.options.find(o => o.value === value)?.text;
});

const optionIsSelected = computed(() => {
    if (props.multiple) {
        return value => props.modelValue.includes(value);
    } else {
        return value => props.modelValue === value;
    }
});

const filteredOptions = computed(() => {
    if (props.searchEnabled && searchString.value.length) {
        return props.options.filter(o => {
            return o.value?.toLowerCase().includes(searchString.value?.toLowerCase()) || o.text?.toLowerCase().includes(searchString.value?.toLowerCase());
        });
    }
    return props.options;
});

const searchWrapper = ref();

watch(searchWrapper, () => {
    if (searchWrapper.value) {
        const input = searchWrapper.value.querySelector('input');
        if (input.focus) input.focus();
    }
});
</script>

<template>
    <FormGroup>
        <div @click="openDropdown" class="relative">
            <div :class="isOpen ? 'focus' : ''" class="dropdown text-gray-600 bg-white font-normal w-full flex items-center pl-3 pr-0 py-2 text-sm border-gray-300 rounded border shadow-sm">
                <div class="w-full">
                    <div v-if="!props.modelValue?.length && emptyValuePlaceholderText" class="text-gray-500 whitespace-nowrap" v-text="emptyValuePlaceholderText || $t('noItemsSelected')"></div>
                    <div v-if="(!props.multiple && props.modelValue) || (props.multiple && props.modelValue?.length)" class="pl-3 pr-0 py-2 absolute top-1/2 -translate-y-1/2 left-0 flex flex-auto flex-wrap">
                        <BadgeGroup v-if="props.multiple">
                            <FormDropdownBadge v-for="(value, index) in props.modelValue" :key="index" :text="getOptionTextFromValue(value)" :value="value" @removeOption="removeOption" :show-remove-button="props.badgeShowRemoveButton" />
                        </BadgeGroup>
                        <FormDropdownBadge v-else-if="props.modelValue" :text="getOptionTextFromValue(props.modelValue)" :value="props.modelValue" @removeOption="removeOption" :show-remove-button="props.badgeShowRemoveButton" />
                    </div>
                </div>
                <div class="text-gray-300 border-l flex items-center border-gray-200">
                    <button @click="toggleDropdown" data-dropdown-button class="cursor-pointer text-gray-600 outline-none focus:outline-none px-1">
                        <Icon v-if="isOpen" name="heroicons-solid:chevron-up" />
                        <Icon v-else name="heroicons-solid:chevron-down" />
                    </button>
                </div>
            </div>
            <div v-if="isOpen" ref="dropdownOptions" class="absolute shadow-sm border border-gray-200 mt-2 top-full bg-white z-40 w-full left-0 rounded max-h-80 overflow-y-auto">
                <div class="flex flex-col w-full">
                    <div v-if="props.searchEnabled" class="p-2" ref="searchWrapper">
                        <FormInputField v-model="searchString" :placeholder="$t('search')"></FormInputField>
                    </div>
                    <FormDropdownOption v-for="(option, index) in filteredOptions" :key="index" :value="option.value" :text="option.text" :selected="optionIsSelected(option.value)" @toggleOption="toggleOption" />
                </div>
            </div>
        </div>
    </FormGroup>
</template>

<style scoped>
.dropdown.focus,
.dropdown:focus {
    @apply outline-none border border-primary-300 ring ring-primary-200;
}
</style>
