class Tricinium {
    constructor(tricinium) {
        this.tricinium = tricinium;
    }

    get id() {
        return this.tricinium.id ?? this.tricinium._path.replace(/^.*[\\\/]/, '');
    }

    get nr() {
        return this.tricinium.nr ?? parseInt(this.id.substring(0, 2), 10);
    }

    get title() {
        return this.tricinium.title;
    }

    get incipit() {
        return this.tricinium.incipit;
    }

    get composer() {
        return this.tricinium.composer;
    }

    get localRawFile() {
        return `/lassus-geistliche-psalmen/${this.id}.krn`;
    }

    get rawFile() {
        return this.tricinium.rawFile;
    }

    get sourceFile() {
        return this.tricinium.sourceFile;
    }

    get localUlenbergRawFile() {
        return `/ulenberg-psalmen-davids/0${this.id}.krn`;
    }

    get ulenbergRawFile() {
        return this.tricinium.ulenbergRawFile;
    }

    get ulenbergSourceFile() {
        return this.tricinium.ulenbergSourceFile;
    }

    get lyrics() {
        return this.tricinium.lyrics;
    }

    get mode() {
        return this.tricinium.mode;
    }

    get transposition() {
        return this.tricinium.transposition;
    }

    get finalis() {
        return this.tricinium.finalis;
    }

    get clefs() {
        const clefs = [
            this.tricinium.voices?.cantus?.clef,
            this.tricinium.voices?.tenor?.clef,
            this.tricinium.voices?.bassus?.clef,
        ].filter(c => c);
        return clefs.join(', ') || null;
    }

    get hasLyrics() {
        return !!this.lyrics?.length;
    }

    lyricsAsString(trimSlash = true, separator = ', ') {
        return this.lyrics?.map(l => (trimSlash ? l.text.replace(/\/$/g, '') : l.text)).join(separator) || '';
    }

    getVoiceLyrics(voice) {
        if (this.tricinium.voices) {
            return this.tricinium.voices?.[voice]?.lyrics?.replace(/^\s+|\s+$/g, '');
        }
        return null;
    }

    get normalizedLyrics() {
        return this.lyricsAsString().replace(/[^\p{Letter}\p{Mark}\s]/gu, '').replace(/\s\s/g, ' ');
    }

    get wordOccurrenceCount() {
        const words = {};
        this.normalizedLyrics.split(' ').forEach(el => {
            if (el !== '') {
                words[el] = words[el] ? ++words[el] : 1;
            }
        });
        return Object.fromEntries(Object.entries(words).sort(([, a], [, b]) => b - a));
    }

    get vhvHref() {
        return `https://verovio.humdrum.org/?file=${this.rawFile}`;
    }

    get ulenbergVhvHref() {
        return `https://verovio.humdrum.org/?file=${this.ulenbergRawFile}`;
    }

    getLowestNoteOfVoice(voice) {
        return this.tricinium.voices?.[voice]?.prange?.noteCount.reduce((prev, curr) => prev.keyno < curr.keyno ? prev : curr);
    }

    getHighestNoteOfVoice(voice) {
        return this.tricinium.voices?.[voice]?.prange?.noteCount.reduce((prev, curr) => prev.keyno > curr.keyno ? prev : curr);
    }

    getNoteCountOfVoice(voice) {
        return this.tricinium.voices?.[voice]?.prange?.noteCount;
    }

    getVoiceClef(voice) {
        return this.tricinium.voices?.[voice]?.clef || null;
    }

    getVoiceUrlScan(voice) {
        return this.tricinium.voices?.[voice]?.urlScan || null;
    }

    get cantusFirmus() {
        return this.tricinium.cantusFirmus;
    }

    get cantusFirmusAsString() {
        return this.tricinium.cantusFirmus?.join(',');
    }

    get comments() {
        return this.tricinium.comments || [];
    }

    get originalDocument() {
        return this.tricinium.originalDocument;
    }

    get originalDocumentOwner() {
        return this.tricinium.originalDocumentOwner;
    }

    get prevId() {
        return this.tricinium['@prev'] ?? null;
    }

    get nextId() {
        return this.tricinium['@next'] ?? null;
    }

    get endSound() {
        return [
            this.tricinium.voices.bassus.endSoundFiguredbassNumber.replace('n', '#'),
            this.tricinium.voices.tenor.endSoundFiguredbassNumber.replace('n', '#'),
            this.tricinium.voices.cantus.endSoundFiguredbassNumber.replace('n', '#'),
        ];
    }

    getEndSound(withinOctave = true, accidentals = true, sort = true) {
        const endSound = [...this.endSound];
        if (!accidentals) {
            endSound.forEach((fbNumber, index) => {
                endSound[index] = fbNumber.replace(/\D/g, '');
            });
        }
        if (withinOctave) {
            endSound.forEach((fbNumber, index) => {
                const matches = /(\D*)(\d+)(\D*)/.exec(fbNumber);
                const mod7 = matches[2] % 7;
                endSound[index] = `${matches[1]}${matches[2] > 8 ? (mod7 === 1 ? 8 : mod7) : matches[2]}${matches[3]}`;
            });
        }
        if (sort) {
            endSound.sort((a, b) => {
                return parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, ''));
            });
        }
        return endSound.join(', ');
    }

    get beats() {
        return this.tricinium.beats;
    }
    
    get iiifManifestUrl() {
        return this.tricinium.iiifManifestUrl;
    }

}

export function useTricinium(elements) {
    if (Array.isArray(elements)) {
        return elements.map(t => new Tricinium(t));
    } else if (typeof elements === 'object' && elements !== null) {
        return new Tricinium(elements);
    }
    throw new Error('Cannot convert passsed argument to Tricinium object');
}
