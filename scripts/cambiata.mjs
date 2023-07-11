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

function tokenIsDataRecord(line, includeNullToken = false) {
    return line && !line.startsWith('!') && !line.startsWith('*') && !line.startsWith('=') && !(!includeNullToken && line === '.');
}

function escapeShell(cmd) {
    return '"' + cmd.replace(/(["$`\\])/g, '\\$1') + '"';
}

const files = getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`);

const voiceMap = [
    { spine: 1, name: 'bassus' },
    { spine: 3, name: 'tenor' },
    { spine: 5, name: 'cantus' },
];

const cambiata = ['-2', '-3', '+2'];

execSync(`rm -rf ${__dirname}/../content/cambiata/*`);
execSync(`rm -rf ${__dirname}/../cambiata/*`);
execSync(`mkdir -p ${__dirname}/../content/cambiata/`);
execSync(`mkdir -p ${__dirname}/../cambiata/`);

function getStartLineNumber(kern, beat, beatsBefore = 4) {
    const lines = kern.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const token = line.split('\t')[1];
        if (parseFloat(token) >= parseFloat(beat) - beatsBefore) {
            return i + 1;
        }
    }
    return null;
}

function getEndLineNumber(kern, beat, beatsAfter = 4) {
    const lines = kern.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const token = line.split('\t')[1];
        if (parseFloat(token) >= parseFloat(beat) + beatsAfter) {
            return i + 1;
        }
    }
    return null;
}

files.forEach(file => {
    const id = getIdFromFilename(file);
    console.log(id);

    voiceMap.forEach(voice => {
        // voice exchange will be ignored
        const kern = execSync(`cat ${file} | extractxx -f ${voice.spine} | beat -ca | mint -d `).toString().trim();
        const lines = kern.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const startLine = lines[i];
            const startToken = startLine.split('\t')[0];
            const startBeatToken = startLine.split('\t')[1];
            if (tokenIsDataRecord(startToken)) {
                const startLineNumber = i + 1;
                const mintLines = [];
                for (let j = i + 1; j < lines.length; j++) {
                    const endLine = lines[j];
                    const endToken = endLine.split('\t')[0];
                    const endBeatToken = endLine.split('\t')[1];
                    if (tokenIsDataRecord(endToken))  {
                        const endLineNumber = j + 1;
                        i = j;
                        // check if data token matches cambiata pattern
                        if (endToken === cambiata[mintLines.length]) {
                            mintLines.push(endToken);

                            // if cambiata is found completely
                            if (mintLines.length === 3) {

                                // mark cambiata notes in example
                                const markedKernLines = execSync(`cat ${file}`).toString().trim().split('\n').map((line, lineIndex) => {
                                    const tokens = line.split('\t');
                                    return tokens.map((token, tokenIndex) => {
                                        if (voice.spine - 1 === tokenIndex && tokenIsDataRecord(token) && lineIndex >= startLineNumber - 1 && lineIndex <= endLineNumber - 1) {
                                            return `${token}@`;
                                        }
                                        return token;
                                    }).join('\t');
                                });

                                const exampleStartLineNumber = getStartLineNumber(kern, startBeatToken);
                                const exampleEndLineNumber = getEndLineNumber(kern, endBeatToken);
                                
                                // extract kern of cambiata exmaple
                                const stdout = execSync(`echo ${escapeShell(markedKernLines.join('\n'))} | myank -I -l ${exampleStartLineNumber}-${exampleEndLineNumber} --hide-ending`).toString().trim();
                                const exampleKernLines = stdout.split('\n');
                                exampleKernLines.push('!!!RDF**kern: @ = marked note (cambiata)');
                                const exampleKern = exampleKernLines.filter(line => {
                                    // remove distracting lines
                                    return !(line.match(/^!!\s?cadence/) || line.includes('*xywh'));
                                }).join('\n');
                                

                                const filename = `${uuidv5(exampleKern, UUID_NAMESPACE)}.krn`;
                                fs.writeFileSync(`${__dirname}/../cambiata/${filename}`, exampleKern);

                                const config = {
                                    filename,
                                    startLine: startLineNumber,
                                    endLine: endLineNumber,
                                    voice: voice.name,
                                    startBeat: parseFloat(startBeatToken),
                                    endBeat: parseFloat(endBeatToken),
                                    triciniumId: id,
                                };

                                // save config yaml file
                                const configFileName = `${id}-${voice.name}-${startBeatToken}.yaml`;
                                fs.writeFileSync(`${__dirname}/../content/cambiata/${configFileName}`, yaml.dump(config, {
                                    indent: 4,
                                    lineWidth: -1,
                                    sortKeys: true,
                                }));

                                console.log(startLineNumber, endLineNumber, voice.name);

                                break;
                            }
                        } else {
                            break;
                        }
                    }    
                }
            }
        }
    });
});