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
    return '"' + cmd.replace(/(["'$`\\])/g, '\\$1') + '"';
}

const files = getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`);

const voices = [
    { name: 'bassus', spines: '1,2' },
    { name: 'tenor', spines: '3,4' },
    { name: 'cantus', spines: '5,6' },
];

execSync(`rm -rf ${__dirname}/../content/melisma/*`);
execSync(`rm -rf ${__dirname}/../melisma/*`);
execSync(`mkdir -p ${__dirname}/../content/melisma/`);
execSync(`mkdir -p ${__dirname}/../melisma/`);

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
                    const startLineNumber = i + 1;
                    let endLineNumber = startLineNumber;
                    for (let j = i; j < lines.length; j++) {
                        const endLine = lines[j];
                        const endToken = endLine.split('\t')[0];
                        if (tokenIsDataRecord(endToken, true)) {
                            if (endToken.includes('@') || endToken === '.') {
                                endLineNumber = j + 1;
                            } else {
                                break;
                            }
                        }
                    }
                    i = endLineNumber;
                    const melismaKern = execSync(`cat ${file} | myank -l ${startLineNumber}-${endLineNumber} --hide-ending | extractxx -f ${voice.spines} | ridxx -d`).toString().trim();
                    
                    const melismaFilename = `${uuidv5(melismaKern, UUID_NAMESPACE)}.krn`;
                    fs.writeFileSync(`${__dirname}/../melisma/${melismaFilename}`, melismaKern);

                    const mint = execSync(`echo ${escapeShell(melismaKern)} | extractxx -f 1 | beat -ca | mint -d | ridxx -H`).toString().trim();
                    const notes = mint.split('\n').map(line => line.split('\t')).map(([mint, beat]) => ({
                        mint,
                        beat,
                    }));

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

                    console.log(id, voice.name, startBeat);
                }
            }
        }
    });

});
