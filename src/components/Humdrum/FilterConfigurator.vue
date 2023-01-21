<script setup>
import InputField from '../Form/InputField.vue';
import FormGroup from '../Form/Group.vue';
import Button from '../Button.vue';
import Dropdown from '../Form/Dropdown.vue';
import Checkbox from '../Form/Checkbox.vue';
import ColorPicker from '../Form/ColorPicker.vue';
import { HumdrumFilter, TransposeFilter } from '../../classes/HumdrumFilters.js';

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
// FiguredbassFilter

const emit = defineEmits(['applyFilter']);

const args = reactive({});

function applyFilter() {
    emit('applyFilter', convertArgsToArray());
}

function convertArgsToArray() {
    
    if (props.filter === 'ParallelIntervalsFilter') {
        return [args.interval, args.direction, args.color];
    }

    if (props.filter === 'TransposeFilter') {
        return [args.mode, args.value];
    }

    if (props.filter === 'FiguredbassFilter') {
        return [
            args.compound,
            args.accidentals,
            args.intervallsatz,
            args.sort,
            args.lowest,
            args.normalize,
            args.abbr,
            args.ties,
            args.hideThree,
            args.negative,
            args.above,
            args.baseTrack,
            args.frequency,
            args.kernTracks,
            args.spineTracks,
        ];
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
                color: HumdrumFilter.getNextColor(),
            });
        } else if (props.filter === 'TransposeFilter') {
            Object.assign(args, {
                // mode: TransposeFilter.MODE_INTERVAL,
                mode: undefined,
                value: undefined,
            });
        } else if (props.filter === 'FiguredbassFilter') {
            Object.assign(args, {
                compound: undefined,
                accidentals: undefined,
                intervallsatz: undefined,
                sort: undefined,
                lowest: undefined,
                normalize: undefined,
                abbr: undefined,
                ties: undefined,
                hideThree: undefined,
                negative: undefined,
                above: undefined,
                baseTrack: undefined,
                frequency: undefined,
                kernTracks: undefined,
                spineTracks: undefined,
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
                        h(Dropdown, {
                            modelValue: args.mode,
                            ['onUpdate:modelValue']: value => { args.mode = value; },
                            label: t('mode'),
                            options: [
                                { value: '-k', text: t('transpositionMode.key') },
                                { value: '-t', text: t('transpositionMode.interval') },
                            ],
                            multiple: false,
                            searchEnabled: false,
                        }),
                        h(InputField, {
                            ['onUpdate:modelValue']: value => { args.value = value; },
                            label: t('value'),
                            placeholder: 'P5, -M3, -m7; C, d, E-, f#',
                        }),
                    ];
                    break;
                case 'SicFilter':
                    elems = [
                        h(Dropdown, {
                            modelValue: args.value,
                            ['onUpdate:modelValue']: value => { args.value = value; },
                            label: t('value'),
                            options: [
                                { value: 'substitution', text: 'substitution' },
                                { value: 'original', text: 'original' },
                                { value: 'remove', text: 'remove' },
                                { value: 'quiet', text: 'quiet' },
                            ],
                            multiple: false,
                            searchEnabled: false,
                        }),
                    ];
                    break;
                case 'FiguredbassFilter':
                    elems = [
                        h(Checkbox, {
                            modelValue: args.compound,
                            ['onUpdate:modelValue']: value => { args.compound = value; },
                            label: t('fb.compound'),
                        }),
                        h(Checkbox, {
                            modelValue: args.accidentals,
                            ['onUpdate:modelValue']: value => { args.accidentals = value; },
                            label: t('fb.accidentals'),
                        }),
                        h(Checkbox, {
                            modelValue: args.intervallsatz,
                            ['onUpdate:modelValue']: value => { args.intervallsatz = value; },
                            label: t('fb.intervallsatz'),
                        }),
                        h(Checkbox, {
                            modelValue: args.sort,
                            ['onUpdate:modelValue']: value => { args.sort = value; },
                            label: t('fb.sort'),
                        }),
                        h(Checkbox, {
                            modelValue: args.lowest,
                            ['onUpdate:modelValue']: value => { args.lowest = value; },
                            label: t('fb.lowest'),
                        }),
                        h(Checkbox, {
                            modelValue: args.normalize,
                            ['onUpdate:modelValue']: value => { args.normalize = value; if (value) { args.compound = true; args.sort = true; } },
                            label: t('fb.normalize'),
                        }),
                        h(Checkbox, {
                            modelValue: args.abbr,
                            ['onUpdate:modelValue']: value => { args.abbr = value; if (value) { args.normalize = true; args.compound = true; args.sort = true; } },
                            label: t('fb.abbr'),
                        }),
                        h(Checkbox, {
                            modelValue: args.ties,
                            ['onUpdate:modelValue']: value => { args.ties = value; },
                            label: t('fb.ties'),
                        }),
                        h(Checkbox, {
                            modelValue: args.hideThree,
                            ['onUpdate:modelValue']: value => { args.hideThree = value; },
                            label: t('fb.hideThree'),
                        }),
                        h(Checkbox, {
                            modelValue: args.negative,
                            ['onUpdate:modelValue']: value => { args.negative = value; },
                            label: t('fb.negative'),
                        }),
                        h(Checkbox, {
                            modelValue: args.above,
                            ['onUpdate:modelValue']: value => { args.above = value; },
                            label: t('fb.above'),
                        }),
                        h(Dropdown, {
                            modelValue: args.baseTrack,
                            ['onUpdate:modelValue']: value => { args.baseTrack = value; },
                            label: t('fb.baseTrack'),
                            options: [
                                { value: '1', text: t('voice.bassus') },
                                { value: '2', text: t('voice.tenor') },
                                { value: '3', text: t('voice.cantus') },
                            ],
                            multiple: false,
                            searchEnabled: false,
                        }),
                        h(InputField, {
                            modelValue: args.frequency,
                            ['onUpdate:modelValue']: value => { args.frequency = value; },
                            label: t('fb.frequency'),
                            placeholder: '4; 4.; 8; 2',
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
