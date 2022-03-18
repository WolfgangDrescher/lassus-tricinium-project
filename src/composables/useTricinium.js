import { computed } from 'vue';

export class Tricinium {
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

    get transposed() {
        return this.tricinium.transposed;
    }

    get finalis() {
        return this.tricinium.finalis;
    }

    get clefs() {
        return this.tricinium.clefs;
    }

    get hasLyrics() {
        return !!this.lyrics?.length;
    }

    lyricsAsString(trimSlash = true, separator = ', ') {
        return this.lyrics?.map((l) => (trimSlash ? l.text.replace(/\/$/g, '') : l.text)).join(separator) || '';
    }

    getVoiceLyrics(voice) {
        if(this.tricinium.voices) {
            return this.tricinium.voices[voice]?.lyrics?.replace(/^\s+|\s+$/g, '');
        }
        return null;
    }

    get vhvHref() {
        return `https://verovio.humdrum.org/?file=${this.rawFile}`;
    }
}

export function useTricinium(elements) {
    if (Array.isArray(elements)) {
        return elements.map((t) => new Tricinium(t))
    } else if (typeof elements === 'object' && elements !== null) {
        return new Tricinium(elements);
    }
    throw new Error('Cannot convert passsed argument to Tricinium object');
}
