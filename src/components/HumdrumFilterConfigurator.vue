<script setup>
import { defineComponent, reactive, h } from 'vue';
import Button from './Button.vue';
import InputField from './Form/InputField.vue';

const props = defineProps({
    filter: String,
});

// MeasureFilter
// ExtractFilter
// ParallelIntervalsFilter
// ShedFilter
// TransposeFilter

const emit = defineEmits(['applyFilter']);

const args = reactive({});

function applyFilter() {
    emit('applyFilter', Object.entries(args).map(([_, value]) => {
        return value;
    }));
}

const DynamicHumdrumFilter = defineComponent({
    name: 'DynamicHumdrumFilter',
    props: ['filter'],
    setup(props) {
        return () => {
            console.log(props.filter);
            let elems = ['No arguments to set'];
            switch(props.filter) {
                case 'MeasureFilter':
                case 'ExtractFilter':
                case 'ShedFilter':
                    elems = [h(InputField, {
                        onInput: event => { args.value = event.target.value },
                        // label: 'value',
                        placeholder: 'Value',
                    })];
                    break;
                case 'ParallelIntervalsFilter':
                    elems = [
                        h(InputField, {
                            onInput: event => { args.value = event.target.value },
                            // label: 'Interval',
                            placeholder: 'Interval',
                        }),
                        h(InputField, {
                            onInput: event => { args.direction = event.target.value },
                            // label: 'Direction',
                            placeholder: 'Direction (2/-2)',
                        }),
                        h(InputField, {
                            onInput: event => { args.color = event.target.value },
                            // label: 'Color',
                            placeholder: 'Color',
                        })
                    ];
                    break;
                case 'TransposeFilter':
                    elems = [
                        h(InputField, {
                            onInput: event => { args.mode = event.target.value },
                            // label: 'Mode',
                            placeholder: 'Mode (-k / -t)',
                        }),
                        h(InputField, {
                            onInput: event => { args.value = event.target.value },
                            // label: 'Value',
                            placeholder: 'Value (c,d,e,f,g; M3 P5)',
                        }),
                    ];
                    break;
            }
            return h('div', {
                class: 'grid grid-cols-filter gap-4 w-full',
            }, [
                ...elems,
                h(Button, {
                    onClick: applyFilter,
                }, 'Apply')
            ]);
        };
    },
});

</script>

<template>
    <DynamicHumdrumFilter :filter="filter" />
</template>
