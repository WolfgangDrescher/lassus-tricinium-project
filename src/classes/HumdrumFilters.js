import { v4 as uuidv4 } from 'uuid';

export class HumdrumFilter {
    static linePrefix = '!!!filter: ';

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

    toString() {
        return this.lines.map((l) => `${HumdrumFilter.linePrefix}${l}`).join('\n');
    }
}

export class HumdrumClefFilter extends HumdrumFilter {
    lines = [
        'shed -e "s/^clefC[12]/clefG2/I; s/^clefC[34]/clefGv2/I; s/^clefC5/clefF4/I; s/^clefF[35]/clefF4/I; s/^clefG[13]/clefG2/I"',
    ];
}

export class HumdrumMensuralFilter extends HumdrumFilter {
    lines = ['kern2mens'];
    unique = true;
}

export class HumdrumLyricsFilter extends HumdrumFilter {
    unique = true;
    priority = -1;
    lines = ['extract -I **text'];
}

export class HumdrumEditorialAccidentalsFilter extends HumdrumFilter {
    lines = ["shed -ke 's/i/y/g'"];
    unique = true;
}

export class HumdrumCompositeRhythmFilter extends HumdrumFilter {
    lines = ['composite'];
    unique = true;
}

export class HumdrumMeasureFilter extends HumdrumFilter {
    changeable = true;
    constructor(value) {
        super();
        if (!this.validateValue(value)) {
            throw new Error(`Cannot set "${value}" as value for ${this.className}`);
        }
        this.lines.push(`myank -m ${value}`);
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
        this.lines.push(`extract -f ${value}`);
    }

    validateValue(value) {
        if (/^[1-9]\d*(,[1-9]\d*)*$/.test(value)) return true;
        if (/^[1-9]\d*-[1-9]\d*$/.test(value)) return true;
        return false;
    }
}
