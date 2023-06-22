class Melisma {
    constructor(melisma, tricinium) {
        this.melisma = melisma;
        this.tricinium = tricinium;
    }

    get id() {
        return this.melisma._id;
    }

    get startLine() {
        return this.melisma.startLine;
    }

    get endLine() {
        return this.melisma.endLine;
    }

    get filename() {
        return this.melisma.filename;
    }

    get triciniumId() {
        return this.melisma.triciniumId;
    }

    get startBeat() {
        return this.melisma.startBeat;
    }

    get voice() {
        return this.melisma.voice;
    }

    get notes() {
        return this.melisma.notes;
    }

    get noteString() {
        return this.notes.map(({ beat, mint }) => `${beat},${mint.replace(/^\[(.+)\]$/, '[]')}`).join(';');
    }
}

export function useMelisma(elements, tricinia) {
    if (Array.isArray(elements)) {
        return elements.map(elem => createMelisma(elem, findTricinium(tricinia, elem.triciniumId)));
    } else if (typeof elements === 'object' && elements !== null) {
        return createMelisma(elements, tricinia);
    }
    throw new Error('Cannot convert passsed arguments to melisma object');
}

function createMelisma(melisma, tricinium) {
    return new Melisma(melisma, tricinium);
}

function findTricinium(tricinia, id) {
    return tricinia.find(t => t.id === id);
}
