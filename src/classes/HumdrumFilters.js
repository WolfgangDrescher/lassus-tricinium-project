import { v4 as uuidv4 } from 'uuid';
import { default as tailwindColors } from 'tailwindcss/colors';

function createColorList() {
    return [
        'red',
        'blue',
        'green',
        'violet',
        'orange',
        'sky',
        'emerald',
        'purple',
        'amber',
        'fuchsia',
    ].map(name => tailwindColors[name][500]);
}

function createMatchedNoteList() {
    const list = [
        // https://github.com/humdrum-tools/verovio-humdrum-viewer/issues/782
        // 'i', 'j', 'l',
        'N', 'V', 'Z', '@', '+', '|', '<', '>',
    ];

    let i;
    for (i = 0; i < 50; i++) {
        list.push(String.fromCodePoint(`0x1F6${i.toString().padStart(2, '0')}`));
    }
    return list;
}

class Line {
    constructor(value, linePrefix) {
        this.value = value || '';
        this.prefix = linePrefix || '!!!filter: ';
    }

    toString() {
        return `${this.prefix}${this.value}`;
    }
}

export class HumdrumFilter {
    static NAME = 'HumdrumFilter';
    id = null;
    unique = false;
    changeable = false;
    priority = 0;
    lines = [];
    configurable = false;

    constructor() {
        this.id = uuidv4();
    }

    get className() {
        return this.constructor.NAME;
    }

    addLine(value, prefix) {
        this.lines.push(new Line(value, prefix));
    }

    beforeRemove() {}

    toString() {
        return this.lines.map(l => l.toString()).join('\n');
    }

    static colors = createColorList();
    static usedColors = [];
    static getNextColor() {
        let color = null;
        HumdrumFilter.colors.some(c => {
            const isUsed = HumdrumFilter.usedColors.includes(c);
            if (!isUsed) {
                color = c;
            }
            return !isUsed;
        });
        if (color) {
            HumdrumFilter.usedColors.push(color);
            return color;
        }
        throw new Error('Cannot create next color');
    }

    static chars = createMatchedNoteList();
    static usedChars = [];
    static getNextMatchedNoteChar() {
        let char = null;
        CintFilter.chars.some(c => {
            const isUsed = CintFilter.usedChars.includes(c);
            if (!isUsed) {
                char = c;
            }
            return !isUsed;
        });
        if (char) {
            CintFilter.usedChars.push(char);
            return char;
        }
        throw new Error('Cannot create an unused char for matched notes mapping');
    }
}

export class ClefsFilter extends HumdrumFilter {
    static NAME = 'ClefsFilter';
    unique = true;
    configurable = true;

    constructor(bassus, tenor, cantus) {
        super();
        if (this.validateValue(bassus)) {
            this.bassus = bassus;
            this.addLine(`shed -s 1 -e "s/^clef[CFG][1-5]/clef${bassus}/I;"`);
        }
        if (this.validateValue(tenor)) {
            this.tenor = tenor;
            this.addLine(`shed -s 3 -e "s/^clef[CFG][1-5]/clef${tenor}/I;"`);
        }
        if (this.validateValue(cantus)) {
            this.cantus = cantus;
            this.addLine(`shed -s 5 -e "s/^clef[CFG][1-5]/clef${cantus}/I;"`);
        }
    }

    validateValue(value) {
        return /^[CFG]v?[1-5]$/.test(value);
    }
}

export class ModernClefsFilter extends HumdrumFilter {
    static NAME = 'ModernClefsFilter';
    unique = true;
    lines = [
        new Line('shed -e "s/^clefC[12]/clefG2/I; s/^clefC[34]/clefGv2/I; s/^clefC5/clefF4/I; s/^clefF[35]/clefF4/I; s/^clefG[13]/clefG2/I"'),
    ];
}

export class MensuralFilter extends HumdrumFilter {
    static NAME = 'MensuralFilter';
    unique = true;
    priority = -2;
    lines = [new Line('kern2mens')];
}

export class HideLyricsFilter extends HumdrumFilter {
    static NAME = 'HideLyricsFilter';
    unique = true;
    priority = -1;
    lines = [new Line('extract -I **text')];
}

export class HideEditorialAccidentalsFilter extends HumdrumFilter {
    static NAME = 'HideEditorialAccidentalsFilter';
    unique = true;
    lines = [new Line("shed -ke 's/i/y/g'")];
}

export class CompositeRhythmFilter extends HumdrumFilter {
    static NAME = 'CompositeRhythmFilter';
    unique = true;
    lines = [new Line('composite')];
}

export class DissonantFilter extends HumdrumFilter {
    static NAME = 'DissonantFilter';
    unique = true;
    lines = [new Line('dissonant')];
}

export class ClausulaFilter extends HumdrumFilter {
    static NAME = 'ClausulaFilter';
    unique = true;
    lines = [new Line('dissonant -V')];
}

export class AutobeamFilter extends HumdrumFilter {
    static NAME = 'AutobeamFilter';
    unique = true;
    lines = [new Line('autobeam')];
}

export class ImitationFilter extends HumdrumFilter {
    static NAME = 'ImitationFilter';
    unique = true;
    lines = [new Line('imitation')];
}

export class MelismaFilter extends HumdrumFilter {
    static NAME = 'MelismaFilter';
    unique = true;
    lines = [new Line('melisma')];
}

export class ShowSicWarningsFilter extends HumdrumFilter {
    static NAME = 'ShowSicWarningsFilter';
    unique = true;
    lines = [new Line('sic -v')];
}

export class SicFilter extends HumdrumFilter {
    static NAME = 'SicFilter';
    unique = true;
    changeable = true;
    configurable = true;

    constructor(value) {
        super();
        if (!this.validateValue(value)) {
            throw new Error(`Cannot set "${value}" as value for ${this.className}`);
        }
        this.value = value;
        this.addLine(`sic -${value.slice(0, 1)}`);
    }

    validateValue(value) {
        return ['substitution', 'original', 'remove', /* 'verbose', */ 'quiet'].includes(value);
    }
}

export class MeasureFilter extends HumdrumFilter {
    static NAME = 'MeasureFilter';

    unique = true;
    changeable = true;
    configurable = true;
    
    constructor(value) {
        super();
        if (!this.validateValue(value)) {
            throw new Error(`Cannot set "${value}" as value for ${this.className}`);
        }
        this.value = value;
        this.addLine(`myank -m ${value} -d -I`);
    }

    validateValue(value) {
        if (/^[1-9]\d*$/.test(value)) return true;
        if (/^[1-9]\d*-[1-9]\d*$/.test(value)) return true;
        if (/^[1-9]\d*(,[1-9]\d*)*$/.test(value)) return true;
        if (/^([1-9]\d*(-[1-9]\d*)?)(,([1-9]\d*(-[1-9]\d*)?))*$/.test(value)) return true;
        return false;
    }
}

export class ExtractSpineFilter extends HumdrumFilter {
    static NAME = 'ExtractSpineFilter';

    unique = true;
    changeable = true;
    configurable = true;

    constructor(value) {
        super();
        if (!this.validateValue(value)) {
            throw new Error(`Cannot set "${value}" as value for ${this.className}`);
        }
        this.value = value;
        this.addLine(`extract -f ${value}`);
    }

    validateValue(value) {
        if (/^[1-9]\d*(,[1-9]\d*)*$/.test(value)) return true;
        if (/^[1-9]\d*-[1-9]\d*$/.test(value)) return true;
        return false;
    }
}

export class ExtractVoiceFilter extends ExtractSpineFilter {
    static NAME = 'ExtractVoiceFilter';
    constructor(value) {
        super(value);
    }
}

export class CintFilter extends HumdrumFilter {
    static NAME = 'CintFilter';

    unique = false;
    configurable = true;

    constructor(interval1, direction, interval2, color) {
        super();
        if (!this.validateInterval(interval1)) {
            throw new Error(`Cannot set "${interval1}" as interval 1 for ${this.className}`);
        }
        if (!this.validateDirection(direction)) {
            throw new Error(`Cannot set "${direction}" as direction for ${this.className}`);
        }
        if (!this.validateInterval(interval2)) {
            throw new Error(`Cannot set "${interval2}" as interval 2 for ${this.className}`);
        }
        if (!this.validateColor(color)) {
            throw new Error(`Cannot set "${color}" as color for ${this.className}`);
        }
        this.interval1 = interval1;
        this.direction = direction;
        this.interval2 = interval2;
        this.color = color;
        this.char = HumdrumFilter.getNextMatchedNoteChar();
        // https://github.com/rism-digital/verovio/issues/2690
        this.addLine(`cint -O --search "${this.interval1} ${this.direction} ${this.interval2}" -N ${this.char} --color ${this.color}`);
    }

    validateInterval(value) {
        return /^[1-8]$/.test(value);
    }

    validateDirection(value) {
        return Number.isInteger(parseInt(value, 10));
    }

    validateColor(value) {
        return /^#([A-Z0-9]{3}){1,2}$/i.test(value);
    }

    beforeRemove() {
        HumdrumFilter.usedChars = HumdrumFilter.usedChars.filter(c => c !== this.char);
        HumdrumFilter.usedColors = HumdrumFilter.usedColors.filter(c => c !== this.color);
    }
}

export class ParallelIntervalsFilter extends CintFilter {
    static NAME = 'ParallelIntervalsFilter';
    static DIRECTION_UP = '2';
    static DIRECTION_DOWN = '-2';
    static DIRECTION_UP_DOWN = '-?2';

    configurable = true;

    constructor(interval, direction, color) {
        super(interval, direction, interval, color);
    }

    validateDirection(value) {
        return [
            ParallelIntervalsFilter.DIRECTION_UP,
            ParallelIntervalsFilter.DIRECTION_DOWN,
            ParallelIntervalsFilter.DIRECTION_UP_DOWN,
        ].includes(value);
    }
}

export class ShedFilter extends HumdrumFilter {
    static NAME = 'ShedFilter';
    configurable = true;
    constructor(value) {
        super();
        this.value = value;
        this.addLine(`shed ${value}`);
    }
}

export class HideCantusFirmusAnnotationFilter extends ShedFilter {
    static NAME = 'HideCantusFirmusAnnotationFilter';
    configurable = false;
    constructor() {
        super("-e 's/LO:TX:(.*)t=c.f.//L s/LO:TX:(.*)t=\\(c.f.\\)//L'");
    }
}

export class HideBarlinesFilter extends ShedFilter {
    static NAME = 'HideBarlinesFilter';
    configurable = false;
    constructor() {
        super('-e "s/^([^-=]*)$/$1-/B"');
    }
}

export class TransposeFilter extends HumdrumFilter {
    static NAME = 'TransposeFilter';
    static MODE_KEY = '-k';
    static MODE_INTERVAL = '-t';

    unique = true;
    changeable = true;
    configurable = true;

    constructor(mode, value) {
        super();
        if (!this.validateMode(mode)) {
            throw new Error(`Cannot set "${mode}" as mode for ${this.className}`);
        }
        if (!this.validateValue(value, mode)) {
            throw new Error(`Cannot set "${value}" as value for ${this.className}`);
        }
        this.mode = mode;
        this.value = value;
        this.addLine(`transpose ${this.mode} ${this.value}`);
    }

    validateMode(value) {
        return [
            TransposeFilter.MODE_KEY,
            TransposeFilter.MODE_INTERVAL,
        ].includes(value);
    }

    validateValue(value, mode) {
        if (mode === TransposeFilter.MODE_KEY) {
            return /^[A-G][-#]?$/i.test(value);
        }
        if (mode === TransposeFilter.MODE_INTERVAL) {
            return /^-?([mM][2367]|[PdA][1458])$/.test(value);
        }

        return false;
    }
}

export class CustomFilter extends HumdrumFilter {
    static NAME = 'CustomFilter';
    configurable = true;
    constructor(value) {
        super();
        this.value = value;
        this.addLine(value);
    }
}

export class FiguredbassFilter extends HumdrumFilter {
    static NAME = 'FiguredbassFilter';
    configurable = true;
    changeable = true;
    unique = true;
    constructor(compound, accidentals, intervallsatz, sort, lowest, normalize, reduce, ties, hideThree, negative, above, baseTrack, rate, kernTracks, spineTracks) {
        super();
        this.compound = compound;
        this.accidentals = accidentals;
        this.intervallsatz = intervallsatz;
        this.sort = sort;
        this.lowest = lowest;
        this.normalize = normalize;
        this.reduce = reduce;
        this.ties = ties;
        this.hideThree = hideThree;
        this.negative = negative;
        this.above = above;
        this.baseTrack = baseTrack;
        this.rate = rate;
        this.kernTracks = kernTracks;
        this.spineTracks = spineTracks;
        this.addLine(this.getLine());
    }

    getLine() {
        const args = ['fb'];
        if (this.compound) args.push('-c');
        if (this.accidentals) args.push('-a');
        if (this.intervallsatz) args.push('-i');
        if (this.sort) args.push('-o');
        if (this.lowest) args.push('-l');
        if (this.normalize) args.push('-n');
        if (this.reduce) args.push('-r');
        if (this.ties) args.push('-t');
        if (this.hideThree) args.push('-3');
        if (this.negative) args.push('-m');
        if (this.above) args.push('--above');
        if (this.baseTrack) args.push(`--base ${this.baseTrack}`);
        if (this.rate) args.push(`--rate ${this.rate}`);
        if (this.kernTracks) args.push(`-k ${this.kernTracks}`);
        if (this.spineTracks) args.push(`-s ${this.spineTracks}`);
        return args.join(' ');
    }
}

export class IntervallsatzPresetFilter extends FiguredbassFilter {
    static NAME = 'IntervallsatzPresetFilter';
    configurable = false;
    changeable = false;
    getLine() {
        return 'fb -i -c -a -t -m';
    }
}

export class FiguredbassPresetFilter extends FiguredbassFilter {
    static NAME = 'FiguredbassPresetFilter';
    configurable = false;
    changeable = false;
    getLine() {
        return 'fb -c -a -o -n -r -3';
    }
}

export class ScaleDegreeFilter extends HumdrumFilter {
    static NAME = 'ScaleDegreeFilter';
    configurable = true;
    changeable = true;
    unique = true;
    constructor(circle, hat, box, solfege, arrow, defaultKey, forceKey, kernTracks, above, color, octave, ties, showRests) {
        super();
        this.circle = circle;
        this.hat = hat;
        this.box = box;
        this.solfege = solfege;
        this.arrow = arrow;
        this.defaultKey = defaultKey;
        this.forceKey = forceKey;
        this.kernTracks = kernTracks;
        this.above = above;
        this.color = color;
        this.octave = octave;
        this.ties = ties;
        this.showRests = showRests;
        this.addLine(this.getLine());
    }

    getLine() {
        const args = ['deg'];
        if (this.circle) args.push('--circle');
        if (this.hat) args.push('--hat');
        if (this.box) args.push('--box');
        if (this.solfege) args.push('--solfege');
        if (this.arrow) args.push('--arrow');
        if (this.above) args.push('--above');
        if (this.octave) args.push('--octave');
        if (this.ties) args.push('--ties');
        if (this.showRests) args.push('-0');
        if (this.defaultKey) args.push(`--default-key ${this.defaultKey}`);
        if (this.forceKey) args.push(`--force-key ${this.forceKey}`);
        if (this.color) args.push(`--color ${this.color}`);
        if (this.kernTracks) args.push(`-k ${this.kernTracks}`);
        return args.join(' ');
    }

    beforeRemove() {
        HumdrumFilter.usedColors = HumdrumFilter.usedColors.filter(c => c !== this.color);
    }
}

export class BassScaleDegreeFilter extends FiguredbassFilter {
    static NAME = 'BassScaleDegreeFilter';
    configurable = false;
    changeable = false;
    getLine() {
        return 'deg --circle -k 1';
    }
}

export class HideSpineDataFilter extends HumdrumFilter {
    static NAME = 'HideSpineDataFilter';
    configurable = true;
    changeable = false;

    constructor(value) {
        super();
        this.value = value;
        this.addLine(`shed -s ${parseInt(value, 10)} -e "s/.*/$0yy/D s/.*//L s/^[^I].*//I"`);
    }
}

export class ShowAllMeasureNumbersFilter extends HumdrumFilter {
    static NAME = 'ShowAllMeasureNumbersFilter';
    configurable = false;
    changeable = false;
    unique = true;

    constructor() {
        super();
        this.addLine('mnumInterval 1', '!!!verovio: ');
    }
}

export class TieSplitFilter extends HumdrumFilter {
    static NAME = 'TieSplitFilter';
    configurable = false;
    changeable = false;
    unique = true;

    constructor() {
        super();
        this.addLine('tie -s');
    }
}