<script setup>
import { defineComponent, reactive, h } from 'vue';
import Button from './Button.vue';
import InputField from './Form/InputField.vue';
import { ColorPicker } from 'vue-color-kit';

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
            switch(props.filter) {
                case 'MeasureFilter':
                case 'ExtractFilter':
                case 'ShedFilter':
                    return h(InputField, {
                        onInput: event => { args.value = event.target.value },
                        // label: 'value',
                        placeholder: 'Value',
                    });
                case 'ParallelIntervalsFilter':
                    return h('div', {}, [
                        h(InputField, {
                            onInput: event => { args.value = event.target.value },
                            // label: 'Interval',
                            placeholder: 'Interval',
                        }),
                        h(InputField, {
                            onInput: event => { args.direction = event.target.value },
                            // label: 'Direction',
                            placeholder: 'Direction',
                        }),
                        h(InputField, {
                            onInput: event => { args.color = event.target.value },
                            // label: 'Color',
                            placeholder: 'Color',
                        })
                    ]);
                case 'TransposeFilter':
                    return h('div', {}, [
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
                    ]);
            }
            return h('div', 'No arguments to set');
        };
    },
});

</script>

<template>
    <div class="flex items-center">
        <DynamicHumdrumFilter :filter="filter" />
        <div class="ml-auto">
            <Button @click="applyFilter">Apply</Button>
        </div>
    </div>
</template>
