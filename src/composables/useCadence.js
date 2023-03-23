class Cadence {
    constructor(cadence, tricinium) {
        this.cadence = cadence;
        this.tricinium = tricinium;
    }

    get id() {
        return this.cadence._id;
    }

    get degree() {
        return this.cadence.degree;
    }

    get startLine() {
        return this.cadence.startLine;
    }

    get endLine() {
        return this.cadence.endLine;
    }

    get filename() {
        return this.cadence.filename;
    }

    get triciniumId() {
        return this.cadence.triciniumId;
    }

    get ultima() {
        return this.cadence.ultima;
    }

    get bassusClausula() {
        return `${this.cadence.voices.bassus.penultima ?? '-'},${this.cadence.voices.bassus.ultima ?? '-'}`;
    }

    get tenorClausula() {
        return `${this.cadence.voices.tenor.penultima ?? '-'},${this.cadence.voices.tenor.ultima ?? '-'}`;
    }

    get cantusClausula() {
        return `${this.cadence.voices.cantus.penultima ?? '-'},${this.cadence.voices.cantus.ultima ?? '-'}`;
    }

    get startBeat() {
        return this.cadence.startBeat;
    }

    get endBeat() {
        return this.cadence.endBeat;
    }

    get slices() {
        return this.cadence.slices;
    }
}

export function useCadence(elements, tricinia) {
    if (Array.isArray(elements)) {
        return elements.map(elem => createCadence(elem, findTricinium(tricinia, elem.triciniumId)));
    } else if (typeof elements === 'object' && elements !== null) {
        return createCadence(elements, tricinia);
    }
    throw new Error('Cannot convert passsed arguments to cadence object');
}

function createCadence(cadence, tricinium) {
    return new Cadence(cadence, tricinium);
}

function findTricinium(tricinia, id) {
    return tricinia.find(t => t.id === id);
}
