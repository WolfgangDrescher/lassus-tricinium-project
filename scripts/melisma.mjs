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
    return !line.startsWith('!') && !line.startsWith('*') && !line.startsWith('=') && !(!includeNullToken && line === '.');
}

function escapeShell(cmd) {
    return '"' + cmd.replace(/(["$`\\])/g, '\\$1') + '"';
}

const files = getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`);

const voices = [
    { name: 'bassus', spines: '1,2' },
    { name: 'tenor', spines: '3,4' },
    { name: 'cantus', spines: '5,6' },
];

execSync(`rm -rf ${__dirname}/../content/melisma/*`);
execSync(`rm -rf ${__dirname}/../kern/melisma/*`);
execSync(`mkdir -p ${__dirname}/../content/melisma/`);
execSync(`mkdir -p ${__dirname}/../kern/melisma/`);

const numberOfWords = 1;

files.forEach(file => {
    const id = getIdFromFilename(file);

    voices.forEach(voice => {
        const kern = execSync(`cat ${file} | extractxx -f ${voice.spines} | melisma | beat -ca`).toString().trim();
        const lines = kern.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const startToken = line.split('\t')[0];
            const startBeat = line.split('\t')[2];
            if (tokenIsDataRecord(startToken)) {
                if (startToken.includes('@')) {

                    console.log(id, voice.name, startBeat);

                    const startLineNumber = i + 1;

                    // calculate end of a melisma
                    let endLineNumber = startLineNumber;
                    for (let j = i + 1; j < lines.length; j++) {
                        const endLine = lines[j];
                        const endToken = endLine.split('\t')[0];
                        const endTextToken = endLine.split('\t')[1] ?? '.';
                        if (tokenIsDataRecord(endToken, true)) {
                            if ((endToken.includes('@') || endToken === '.') && endTextToken === '.') {
                                endLineNumber = j + 1;
                            } else {
                                break;
                            }
                        }
                    }
                    i = endLineNumber - 1;

                    // extract melisma kern
                    const melismaKern = execSync(`cat ${file} | myank -l ${startLineNumber}-${endLineNumber} --hide-ending | extractxx -f ${voice.spines} | ridxx -d`).toString().trim();
                    
                    let exampleStartLineNumber = startLineNumber;
                    let exampleEndLineNumber = endLineNumber;
                    
                    // calculate start line number for numberOfWords before melisma
                    let startWordCount = 0;
                    for (let k = startLineNumber - 2; k >= 0; k--) {
                        const line = lines[k];
                        const textToken = line.split('\t')[1] ?? '.';
                        if (tokenIsDataRecord(textToken) && !textToken.startsWith('-')) {
                            startWordCount++;
                        }
                        if (startWordCount >= numberOfWords) {
                            exampleStartLineNumber = k + 1;
                            break;
                        }
                    }

                    // calculate end line number for numberOfWords after melisma
                    let endWordCount = 0;
                    for (let l = endLineNumber; l < lines.length; l++) {
                        const line = lines[l];
                        const textToken = line.split('\t')[1] ?? '.';
                        if (tokenIsDataRecord(textToken) && !textToken.endsWith('-')) {
                            endWordCount++;
                        }
                        if (endWordCount >= numberOfWords) {
                            exampleEndLineNumber = l + 1;
                            break;
                        }
                    }
                    const exampleMelismaKern = execSync(`cat ${file} | melisma`).toString().trim();

                    // remove marked irrelevant melisma if example has multiple
                    const exampleLines = exampleMelismaKern.split('\n');
                    const exampleKern = exampleLines.map((exampleLine, index) => {
                        if (tokenIsDataRecord(exampleLine) && (index + 1 < startLineNumber || index + 1 > endLineNumber)) {
                            exampleLine = exampleLine.replaceAll('@', '');
                        }
                        return exampleLine;
                    }).join('\n');

                    const parsedExampleKern = execSync(`echo ${escapeShell(exampleKern)} | myank -l ${exampleStartLineNumber}-${exampleEndLineNumber} --hide-ending | extractxx -f ${voice.spines}`).toString().trim();

                    // write melisma kern example file
                    const melismaFilename = `${uuidv5(parsedExampleKern, UUID_NAMESPACE)}.krn`;
                    fs.writeFileSync(`${__dirname}/../kern/melisma/${melismaFilename}`, parsedExampleKern);

                    // calculate melodic intervals and rhythm of the melisma
                    const mint = execSync(`echo ${escapeShell(melismaKern)} | extractxx -f 1 | beat -ca | mint -d | ridxx -H`).toString().trim();
                    const notes = mint.split('\n').map(line => line.split('\t')).map(([mint, beat]) => ({
                        mint,
                        beat,
                    }));

                    // write yaml config
                    const melismaYaml = {
                        triciniumId: id,
                        startLine: startLineNumber,
                        endLine: endLineNumber,
                        voice: voice.name,
                        filename: melismaFilename,
                        notes,
                        startBeat: parseFloat(startBeat),
                    };

                    fs.writeFileSync(`${__dirname}/../content/melisma/${id}-${voice.name}-${startBeat}.yaml`, yaml.dump(melismaYaml, {
                        indent: 4,
                        lineWidth: -1,
                        sortKeys: true,
                    }));

                }
            }
        }
    });

});
