import { v4 as uuidv4 } from 'uuid';

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
    toString() {
        return this.lines.map(l => l.toString()).join('\n');
    }
}

export class HumdrumClefFilter extends HumdrumFilter {
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

export class HumdrumMeasureFilter extends HumdrumFilter {
    changeable = true;
    constructor(value) {
        super();
        if (!this.validateValue(value)) {
            throw new Error(`Cannot set "${value}" as value for ${this.className}`);
        }
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
        this.addLine(`extract -f ${value}`);
    }

    validateValue(value) {
        if (/^[1-9]\d*(,[1-9]\d*)*$/.test(value)) return true;
        if (/^[1-9]\d*-[1-9]\d*$/.test(value)) return true;
        return false;
    }
}
