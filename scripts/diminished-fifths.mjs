import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { v5 as uuidv5 } from 'uuid';
import yaml from 'js-yaml';

const UUID_NAMESPACE = '7698ee82-c78b-4474-91e0-92cd750f2894';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getIdFromFilename(path) {
    return path.split(/[\\\/]/).pop().replace(/\..+$/, '');
}

function getFiles(directory, fileList) {
    fileList = fileList || [];
    let files = fs.readdirSync(directory);
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    for (let i in files) {
        const name = `${directory}/${files[i]}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, fileList);
        } else {
            fileList.push(name);
        }
    }
    return fileList;
}

function resolveToken(lineIndex, spineIndex, lines) {
    for (let i = lineIndex; i >= 0; i--) {
        const token = lines[i].split('\t')[spineIndex];
        if (tokenIsDataRecord(token)) {
            return token;
        }
    }
    return null;
}

const files = getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`);

const voicePairs = [
    '1,3',
    '1,5',
    '3,5',
];

function spineToVoiceName(spineIndex) {
    switch (parseInt(spineIndex, 10)) {
        case 1: return 'bassus';
        case 3: return 'tenor';
        case 5: return 'cantus';
    }
    throw new Error(`No voice name for given spine index: ${spineIndex}`);
}


function getStartLineNumber(kern, beat, beatsBefore = 4) {
    const lines = kern.split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const token = line.split('\t')?.[3];
        if (token && parseFloat(token) <= parseFloat(beat) - beatsBefore) {
            return i + 1;
        }
    }
    return 1;
}

function getEndLineNumber(kern, beat, beatsAfter = 4) {
    const lines = kern.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const token = line.split('\t')?.[3];
        if (token && parseFloat(token) >= parseFloat(beat) + beatsAfter) {
            return i + 1;
        }
    }
    return lines.length;
}

function getResolvedTokenLineIndex(kern, lineIndex, spineIndex) {
    const lines = kern.split('\n');
    for (let i = lineIndex; i >= 0; i--) {
        const line = lines[i];
        const token = line.split('\t')[spineIndex];
        if (tokenIsDataRecord(token)) {
            return i;
        }
    }
    return null;
}

function escapeShell(cmd) {
    return '"' + cmd.replace(/(["$`\\])/g, '\\$1') + '"';
}

function tokenIsDataRecord(line, includeNullToken = false) {
    return line && !line.startsWith('!') && !line.startsWith('*') && !line.startsWith('=') && !(!includeNullToken && line === '.');
}

function getNoteEndLineIndex(lines, lineIndex, spineIndex) {
    let endLineIndex = lineIndex;
    for (let i = lineIndex; i <= lines.length; i++) {
        const line = lines[i];
        const token = line.split('\t')[spineIndex];
        if (tokenIsDataRecord(token)) {
            break;
        }
        if (tokenIsDataRecord(token, true)) {
            endLineIndex = i;
        }
    }
    return endLineIndex;
}

function markScoreLines(lines, lineIndex, lowerVoice, upperVoice) {
    const resolvedLowerLineIndex = getResolvedTokenLineIndex(lines.join('\n'), lineIndex, lowerVoice - 1);
    const resolvedUpperLineIndex = getResolvedTokenLineIndex(lines.join('\n'), lineIndex, upperVoice - 1);

    return lines.map((line, lineIdx) => {
        const tokens = line.split('\t');
        return tokens.map((token, tokenIdx) => {
            if (
                (tokenIdx === parseInt(lowerVoice, 10) - 1 && lineIdx === resolvedLowerLineIndex) ||
                (tokenIdx === parseInt(upperVoice, 10) - 1 && lineIdx === resolvedUpperLineIndex)
            ) {
                return `${token.replace('@', '')}@`;
            }
            return token;
        }).join('\t');
    });
}

let count = 0;

const directoryName = 'diminished-fifths';

execSync(`rm -rf ${__dirname}/../content/${directoryName}/*`);
execSync(`rm -rf ${__dirname}/../kern/${directoryName}/*`);
execSync(`mkdir -p ${__dirname}/../content/${directoryName}/`);
execSync(`mkdir -p ${__dirname}/../kern/${directoryName}/`);

files.forEach(file => {
    const id = getIdFromFilename(file);
    console.log(id);

    voicePairs.forEach(voicePair => {
        const kern = execSync(`cat ${file} | extractxx -f ${voicePair} | fb --hint -c | beat -ca`).toString().trim();
        const lines = kern.split('\n');
        const resolvedStartLines = [];
        lines.forEach((line, lineIndex) => {
            const hintToken = line.split('\t')?.[1];
            if (hintToken && tokenIsDataRecord(hintToken) && hintToken.includes('d5')) {
                
                const beatToken = line.split('\t')[3];
                const lineNumber = lineIndex + 1;
                const lowerVoice = voicePair.split(',')[0];
                const upperVoice = voicePair.split(',')[1];

                const lowerVoiceMarkedLineIndex = getResolvedTokenLineIndex(kern, lineIndex, 0);
                const upperVoiceMarkedLineIndex = getResolvedTokenLineIndex(kern, lineIndex, 2);

                if (resolvedStartLines.includes(lowerVoiceMarkedLineIndex) || resolvedStartLines.includes(upperVoiceMarkedLineIndex)) {
                    return;
                }

                resolvedStartLines.push(lowerVoiceMarkedLineIndex);
                resolvedStartLines.push(upperVoiceMarkedLineIndex);
                
                const endLineIndex = Math.max(getNoteEndLineIndex(lines, lineIndex, 0), getNoteEndLineIndex(lines, lineIndex, 2));
                const startLineIndex = Math.min(lowerVoiceMarkedLineIndex, upperVoiceMarkedLineIndex);

                // mark diminished fifth notes in example
                let markedKernLines = execSync(`cat ${file}`).toString().trim().split('\n');
                for (let i = startLineIndex; i <= endLineIndex; i++) {
                    const lineHintToken = lines[i].split('\t')?.[1];
                    if (lineHintToken === 'd5') {
                        markedKernLines = markScoreLines(markedKernLines, i, lowerVoice, upperVoice);
                    }
                }

                const exampleStartLineNumber = getStartLineNumber(kern, beatToken);
                const exampleEndLineNumber = getEndLineNumber(kern, beatToken);

                // extract kern of diminished fifth exmaple
                const stdout = execSync(`echo ${escapeShell(markedKernLines.join('\n'))} | myank -I -l ${exampleStartLineNumber}-${exampleEndLineNumber} --hide-ending`).toString().trim();
                const exampleKernLines = stdout.split('\n');
                exampleKernLines.push('!!!RDF**kern: @ = marked note (diminished fifth)');
                const exampleKern = exampleKernLines.filter(line => {
                    // remove distracting lines
                    return !(line.match(/^!!\s?cadence/) || line.includes('*xywh'));
                }).join('\n');
                
                const filename = `${uuidv5(exampleKern, UUID_NAMESPACE)}.krn`;
                fs.writeFileSync(`${__dirname}/../kern/${directoryName}/${filename}`, exampleKern);

                const config = {
                    lineNumber,
                    lowerVoice: spineToVoiceName(lowerVoice),
                    upperVoice: spineToVoiceName(upperVoice),
                    filename,
                    triciniumId: id,
                    beat: parseFloat(beatToken),
                };

                console.log(voicePair, lineNumber);

                // save config yaml file
                const configFileName = `${id}-${beatToken}.yaml`;
                fs.writeFileSync(`${__dirname}/../content/${directoryName}/${configFileName}`, yaml.dump(config, {
                    indent: 4,
                    lineWidth: -1,
                    sortKeys: true,
                }));

                count++;

            }
        });
    });

});

console.log('Total count: ', count);