<script setup>
import InputField from '../Form/InputField.vue';
import FormGroup from '../Form/Group.vue';
import Button from '../Button.vue';
import Dropdown from '../Form/Dropdown.vue';
import ColorPicker from '../Form/ColorPicker.vue';

const { t } = useI18n();

const props = defineProps({
    filter: String,
});

// MeasureFilter
// ExtractSpineFilter
// ExtractVoiceFilter
// CintFilter
// ParallelIntervalsFilter
// ShedFilter
// TransposeFilter
// SicFilter
// CustomFilter

const emit = defineEmits(['applyFilter']);

const args = reactive({});

function applyFilter() {
    emit('applyFilter', convertArgsToArray());
}

function convertArgsToArray() {
    
    if (props.filter === 'ParallelIntervalsFilter') {
        return [args.interval, args.direction, args.color];
    }

    return Object.entries(args).map(([_, value]) => {
        return value;
    });
};

const DynamicHumdrumFilter = defineComponent({
    name: 'DynamicHumdrumFilter',
    props: ['filter'],
    setup(props) {
        
        if (props.filter === 'ParallelIntervalsFilter') {
            Object.assign(args, {
                interval: undefined,
                direction: undefined,
                color: '#EF4444',
            });
        } else {
            Object.assign(args, {});
        }

        return () => {
            let elems = [t('noArguments')];
            switch (props.filter) {
                case 'MeasureFilter':
                    elems = [h(InputField, {
                        ['onUpdate:modelValue']: value => { args.value = value; },
                        label: t('measuresToYank'),
                        placeholder: '1; 4-8; 1,3,5',
                    })];
                    break;
                case 'ExtractSpineFilter':
                    elems = [h(InputField, {
                        ['onUpdate:modelValue']: value => { args.value = value; },
                        label: t('extractionOfParticularSpines'),
                        placeholder: '1; 1-4; 1,3,5',
                    })];
                    break;
                case 'ExtractVoiceFilter':
                    elems = [h(Dropdown, {
                        modelValue: args.value ? args.value.split(',') : [],
                        ['onUpdate:modelValue']: value => { args.value = value.join(','); },
                        label: t('extractionOfParticularSpines'),
                        options: [
                            { value: '1', text: t('voice.bassus') },
                            { value: '2', text: `${t('lyrics')} ${t('voice.bassus')}` },
                            { value: '3', text: t('voice.tenor') },
                            { value: '4', text: `${t('lyrics')} ${t('voice.tenor')}` },
                            { value: '5', text: t('voice.cantus') },
                            { value: '6', text: `${t('lyrics')} ${t('voice.cantus')}` },
                        ],
                        multiple: true,
                        searchEnabled: false,
                    })];
                    break;
                case 'ShedFilter':
                    elems = [h(InputField, {
                        ['onUpdate:modelValue']: value => { args.value = value; },
                        label: t('regularExpression'),
                        placeholder: '-e "s/^clefC[12]/clefG2/I"; -ke "s/i/y/g"',
                    })];
                    break;
                case 'CustomFilter':
                    elems = [h(InputField, {
                        ['onUpdate:modelValue']: value => { args.value = value; },
                        label: t('humdrumFilter'),
                        placeholder: 'extract -I **text | shed -e "s/^clefC[12]/clefG2/I"',
                    })];
                    break;
                case 'ParallelIntervalsFilter':
                    elems = [
                        h(InputField, {
                            modelValue: args.interval,
                            ['onUpdate:modelValue']: value => { args.interval = value; },
                            label: t('interval'),
                            placeholder: '1,2,3,4,5,6,7,8',
                        }),
                        h(Dropdown, {
                            modelValue: args.direction,
                            ['onUpdate:modelValue']: value => { args.direction = value; },
                            label: t('direction'),
                            options: [
                                { value: '2', text: t('ascending') },
                                { value: '-2', text: t('descending') },
                                { value: '-?2', text: t('ascendingAndDescending') },
                            ],
                            multiple: false,
                            searchEnabled: false,
                        }),
                        h(ColorPicker, {
                            modelValue: args.color,
                            ['onUpdate:modelValue']: value => { args.color = value; },
                            label: t('color'),
                        }),
                    ];
                    break;
                case 'TransposeFilter':
                    elems = [
                        h(InputField, {
                            ['onUpdate:modelValue']: value => { args.value = value; },
                            // label: 'Mode',
                            placeholder: 'Mode (-k / -t)',
                        }),
                        h(InputField, {
                            ['onUpdate:modelValue']: value => { args.value = value; },
                            // label: 'Value',
                            placeholder: 'Value (c,d,e,f,g; M3 P5)',
                        }),
                    ];
                    break;
                case 'SicFilter':
                    elems = [
                        h(InputField, {
                            ['onUpdate:modelValue']: value => { args.value = value; },
                            // label: 'Value',
                            placeholder: 'substitution, original, remove, quiet',
                        }),
                    ];
                    break;
            }
            return h('div', {
                class: 'grid grid-cols-filter gap-4 w-full',
            }, [
                ...elems,
                h(FormGroup, {label: ''}, [
                    h(Button, {
                        label: false,
                        onClick: applyFilter,
                    }, t('apply')),
                ]),
            ]);
        };
    },
});
</script>

<template>
    <DynamicHumdrumFilter :filter="filter" />
</template>
