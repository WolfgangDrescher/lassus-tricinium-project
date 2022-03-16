import { v4 as uuidv4 } from 'uuid';

function createMatchedNoteList() {
    const list = [];
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
    id = null;
    className = null;
    unique = false;
    changeable = false;
    priority = 0;
    lines = [];

    constructor() {
        this.id = uuidv4();
        this.className = this.constructor.name;
    }

    addLine(value, prefix) {
        this.lines.push(new Line(value, prefix));
    }

    beforeRemove() {}

    toString() {
        return this.lines.map(l => l.toString()).join('\n');
    }
}

export class HumdrumClefFilter extends HumdrumFilter {
    unique = true;
    lines = [
        new Line('shed -e "s/^clefC[12]/clefG2/I; s/^clefC[34]/clefGv2/I; s/^clefC5/clefF4/I; s/^clefF[35]/clefF4/I; s/^clefG[13]/clefG2/I"'),
    ];
}

export class HumdrumMensuralFilter extends HumdrumFilter {
    unique = true;
    lines = [new Line('kern2mens')];
}

export class HumdrumLyricsFilter extends HumdrumFilter {
    unique = true;
    priority = -1;
    lines = [new Line('extract -I **text')];
}

export class HumdrumEditorialAccidentalsFilter extends HumdrumFilter {
    unique = true;
    lines = [new Line("shed -ke 's/i/y/g'")];
}

export class HumdrumCompositeRhythmFilter extends HumdrumFilter {
    unique = true;
    lines = [new Line('composite')];
}

export class HumdrumDissonantFilter extends HumdrumFilter {
    unique = true;
    lines = [new Line('dissonant')];
}

export class HumdrumAutobeamFilter extends HumdrumFilter {
    unique = true;
    lines = [new Line('autobeam')];
}

export class HumdrumImitationFilter extends HumdrumFilter {
    unique = true;
    lines = [new Line('imitation')];
}

export class HumdrumMelismaFilter extends HumdrumFilter {
    unique = true;
    lines = [new Line('melisma')];
}

export class HumdrumSicFilter extends HumdrumFilter {
    unique = true;
    lines = [new Line('sic -v')];
}

export class HumdrumMeasureFilter extends HumdrumFilter {
    unique = true;
    changeable = true;
    constructor(value) {
        super();
        if (!this.validateValue(value)) {
            throw new Error(`Cannot set "${value}" as value for ${this.className}`);
        }
        this.value = value;
        this.addLine(`myank -m ${value}`);
    }

    validateValue(value, numberOfMeasures) {
        if (/^[1-9]\d*$/.test(value)) return true;
        if (/^[1-9]\d*-[1-9]\d*$/.test(value)) return true;
        return false;
    }
}

export class HumdrumExtractFilter extends HumdrumFilter {
    unique = true;
    changeable = true;
    constructor(value) {
        super();
        if (!this.validateValue(value)) {
            throw new Error(`Cannot set "${value}" as value for ${this.className}`);
        }
        this.value = value
        this.addLine(`extract -f ${value}`);
    }

    validateValue(value) {
        if (/^[1-9]\d*(,[1-9]\d*)*$/.test(value)) return true;
        if (/^[1-9]\d*-[1-9]\d*$/.test(value)) return true;
        return false;
    }
}

export class HumdrumCintFilter extends HumdrumFilter {
    unique = false;
    static chars = createMatchedNoteList();
    static usedChars = [];
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
        this.char = this.getNextMatchedNoteChar();
        this.addLine(`cint -O --search "${this.interval1} ${this.direction} ${this.interval2}" -N ${this.char}`);
        this.addLine(`${this.char} = matched note, color=${this.color}`, '!!!RDF**kern: ');
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

    getNextMatchedNoteChar() {
        let char = null;
        HumdrumCintFilter.chars.some(c => {
            const isUsed = HumdrumCintFilter.usedChars.includes(c);
            if(!isUsed) {
                char = c;
            }
            return !isUsed;
        });
        if(char) {
            HumdrumCintFilter.usedChars.push(char);
            return char;
        }
        throw new Error('Cannot create an unused char for matched notes mapping');
    }

    beforeRemove() {
        HumdrumCintFilter.usedChars = HumdrumCintFilter.usedChars.filter(c => c !== this.char);
    }
}

export class HumdrumParallelIntervalsFilter extends HumdrumCintFilter {
    static DIRECTION_UP = 2;
    static DIRECTION_DOWN = -2;

    constructor(interval, direction, color) {
        super(interval, direction, interval, color);
    }

    validateDirection(value) {
        return [
            HumdrumParallelIntervalsFilter.DIRECTION_UP,
            HumdrumParallelIntervalsFilter.DIRECTION_DOWN
        ].includes(parseInt(value, 10));
    }
}

export class HumdrumShedFilter extends HumdrumFilter {
    constructor(value) {
        super()
        this.value = value;
        this.addLine(`shed ${value}`);
    }
}
