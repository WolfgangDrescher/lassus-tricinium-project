import { execSync } from 'node:child_process';
import fs from 'node:fs';
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

function escapeShell(cmd) {
    return '"' + cmd.replace(/(["'$`\\])/g, '\\$1') + '"';
}

const voiceMap = [
    { spine: 1, name: 'bassus' },
    { spine: 3, name: 'tenor' },
    { spine: 5, name: 'cantus' },
];

function getClausulaForVoice(kern, spine, cadenceUltima, dataRecordLineIndexFromEnd = 1) {
    const voiceKern = execSync(`echo ${escapeShell(kern)} | extract -f ${spine}`).toString();
    const dataRecordLines = voiceKern.split('\n').filter(line => lineIsDataRecord(line)).filter(l => l);

    const noteRecord = dataRecordLines[dataRecordLines.length - dataRecordLineIndexFromEnd] ?? null;
    if (noteRecord === null) return null;
    const [, penultimaPitch] = /^\[?\d+\.*([a-zA-Z]+)/.exec(noteRecord);
    if (penultimaPitch.includes('r')) return 0;

    const scaleDegreeKern = `**kern	**kern
${cadenceUltima.toUpperCase()}	${penultimaPitch.toLowerCase()}`;
    const stdout = execSync(`echo ${escapeShell(scaleDegreeKern)} | hint -l -d -c`).toString();
    const scaleDegree = parseInt(stdout.split('\n')[1], 10);

    return scaleDegree;
}

function lineIsDataRecord(line, includeNullToken = false) {
    return !line.startsWith('!') && !line.startsWith('*') && !line.startsWith('=') && !(!includeNullToken && line === '.');
}

function getFinalisFromFile(file) {
    const stdout = execSync(`extract -f 1 ${file} | grep '^\\*[A-Ha-h]:'`);
    const regex = new RegExp(/^\*([a-hA-H]):(\w{3})$/);
    const matches = regex.exec(stdout.toString().trim());
    const finalis = matches[1].toLowerCase();
    return finalis;
}

function getCadenceDegree(cadenceUltima, finalis) {
    const kern = `**kern	**kern
${finalis.toUpperCase()}	${cadenceUltima.toLowerCase()}`;
    const stdout = execSync(`echo ${escapeShell(kern)} | hint -l -d -c`).toString();
    return parseInt(stdout.split('\n')[1], 10);
}

execSync(`rm -rf ${__dirname}/../content/cadences/*`);
execSync(`rm -rf ${__dirname}/../cadences/*`);

getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`).forEach(file => {
    const id = getIdFromFilename(file);
    console.log(id);
    const kern = fs.readFileSync(file, 'utf8');
    const findCadenceStartRegex = /^!![^\S\r\n]?cadence[^\S\r\n]start[^\S\r\n]?([\w]+)?([^\S\r\n]?;[^\S\r\n]?ultima[^\S\r\n]?=[^\S\r\n]?([\w\-#]+))?/gm;
    const findCadenceEndRegex = /^!![^\S\r\n]?cadence[^\S\r\n]end[^\S\r\n]?([\w]+)?([^\S\r\n]?;[^\S\r\n]?ultima[^\S\r\n]?=[^\S\r\n]?([\w\-#]+))?/gm;

    const kernBeats = execSync(`cat ${file} | beat -c`).toString().trim();
    const kernBeatsLines = kernBeats.split('\n');

    let startResult;
    let endResult;

    while ((startResult = findCadenceStartRegex.exec(kern)) !== null) {
        while ((endResult = findCadenceEndRegex.exec(kern)) !== null) {
            if (startResult.index < endResult.index && startResult[1] === startResult[1]) {
                // yank score
                const startLine = kern.substring(0, startResult.index).split('\n').length;
                const ultima = (startResult[3] ?? endResult[3])?.toLowerCase();
                const degree = getCadenceDegree(ultima, getFinalisFromFile(file));
                const endLine = kern.substring(0, endResult.index).split('\n').length;
                console.log(startLine, endLine);

                const stdout = execSync(`cat ${file} | myank -I -l ${startLine}-${endLine} --hide-ending`).toString();
                const cadenceFileLines = stdout.split('\n').filter(line => {
                    return !(line.match(/^!!\s?cadence/) || line.includes('*xywh'));
                });
                const fileContent = cadenceFileLines.join('\n');
                const cadenceFilename = `${uuidv5(fileContent, UUID_NAMESPACE)}.krn`;
                fs.writeFileSync(`${__dirname}/../cadences/${cadenceFilename}`, fileContent);

                const voices = voiceMap.reduce((accumulator, voice) => {
                    accumulator[voice.name] = {};
                    return accumulator;
                }, {});
                voiceMap.forEach(voice => {
                    voices[voice.name].ultima = getClausulaForVoice(fileContent, voice.spine, ultima, 1);
                    voices[voice.name].penultima = getClausulaForVoice(fileContent, voice.spine, ultima, 2);
                });

                let startBeat = null;
                for (let i = startLine + 1; i <= endLine; i++) {
                    if (kernBeatsLines[i].match(/^\d+$/)) {
                        startBeat = parseInt(kernBeatsLines[i], 10);
                        break;
                    }
                }

                let endBeat = null;
                for (let i = endLine -1; i >= 0; i--) {
                    if (kernBeatsLines[i].match(/^\d+$/)) {
                        endBeat = parseInt(kernBeatsLines[i], 10);
                        break;
                    }
                }

                // set yaml config
                const config = {
                    triciniumId: id,
                    filename: cadenceFilename,
                    ultima: ultima ?? null,
                    degree: degree ?? null,
                    startLine,
                    endLine,
                    voices,
                    startBeat,
                    endBeat,
                };
                const configFileName = `${id}-${endBeat}.yaml`;
                fs.writeFileSync(`${__dirname}/../content/cadences/${configFileName}`, yaml.dump(config, {
                    indent: 4,
                    lineWidth: -1,
                    sortKeys: true,
                }));

                break;
            }
        }
    }
});
