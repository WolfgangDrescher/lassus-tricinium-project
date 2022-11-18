class Tricinium {
    constructor(tricinium) {
        this.tricinium = tricinium;
    }

    get id() {
        return this.tricinium.id;
    }

    get nr() {
        return this.tricinium.nr;
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

    get rawFile() {
        return this.tricinium.rawFile;
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
        ];
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
            return this.tricinium.voices[voice]?.lyrics?.replace(/^\s+|\s+$/g, '');
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
}

export function useTricinium(elements) {
    if (Array.isArray(elements)) {
        return elements.map(t => new Tricinium(t));
    } else if (typeof elements === 'object' && elements !== null) {
        return new Tricinium(elements);
    }
    throw new Error('Cannot convert passsed argument to Tricinium object');
}
