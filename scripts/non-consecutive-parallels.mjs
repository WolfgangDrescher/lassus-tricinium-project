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
    return '"' + cmd.replace(/(["'$`\\])/g, '\\$1') + '"';
}

function getTokenPitch(lineIndex, spineIndex, lines) {
    for (let i = lineIndex; i >= 0; i--) {
        const token = lines[i].split('\t')[spineIndex];
        if (tokenIsDataRecord(token)) {
            return token.replaceAll(/[^a-zA-Z\-#]/g, '')
        }
    }
    return null;
}
function createHelperScore(startLower, startUpper, endLower, endUpper) {
    return `**kern	**kern
4${startLower}	4${startUpper}
4${endLower}	4${endUpper}`;
}

function spineToVoiceName(spineIndex) {
    switch (parseInt(spineIndex, 10)) {
        case 1: return 'bassus';
        case 3: return 'tenor';
        case 5: return 'cantus';
    }
    throw new Error(`No voice name for given spine index: ${spineIndex}`);
}


const files = getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`);

const voicePairs = [
    '1,3',
    '1,5',
    '3,5',
];

const directoryName = 'non-consecutive-parallels';

execSync(`rm -rf ${__dirname}/../content/${directoryName}/*`);
execSync(`rm -rf ${__dirname}/../${directoryName}/*`);
execSync(`mkdir -p ${__dirname}/../content/${directoryName}/`);
execSync(`mkdir -p ${__dirname}/../${directoryName}/`);

files.forEach(file => {
    const id = getIdFromFilename(file);
    console.log(id);

    voicePairs.forEach(voicePair => {

        const [lowerVoiceIndex, upperVoiceIndex] = voicePair.split(',').map(n => parseInt(n, 10) - 1);

        // voice exchange will be ignored
        const kern = execSync(`cat ${file} | extractxx -f ${voicePair} | fb -cm | beat -ca`).toString().trim();
        const lines = kern.split('\n');
        ['5', '8'].forEach(parallelInterval => {
            for (let i = 0; i < lines.length; i++) {
                const startLine = lines[i];
                const startFbToken = startLine.split('\t')[1];
                const startBeatToken = startLine.split('\t')[3];
                const startLineNumber = i + 1;
                let dataTokenCount = 0;
                let middleInterval = null;
                let activeVoice = null;
                if (tokenIsDataRecord(startFbToken) && startFbToken === parallelInterval) {
                    dataTokenCount++;
                    for (let j = startLineNumber; j < lines.length; j++) {
                        const endLine = lines[j];
                        const endLineNumber = j + 1;
                        const endKernTokenLower = endLine.split('\t')[0];
                        const endFbToken = endLine.split('\t')[1];
                        const endKernTokenUpper = endLine.split('\t')[2];
                        const endBeatToken = endLine.split('\t')[3];
                        if (tokenIsDataRecord(endFbToken)) {

                            // Ignore line when both voices have null tokens
                            if (endKernTokenLower === '.' && endKernTokenUpper === '.') {
                                continue;
                            }

                            dataTokenCount++;

                            const startLowerPitch = getTokenPitch(i, 0, lines);
                            const startUpperPitch = getTokenPitch(i, 2, lines);
                            const endLowerPitch = getTokenPitch(j, 0, lines);
                            const endUpperPitch = getTokenPitch(j, 2, lines);

                            if (dataTokenCount === 2) {
                                middleInterval = endFbToken;
                                // Stop when not at least one voice stays on the same note
                                if (!(
                                    (startLowerPitch === endLowerPitch) ||
                                    (startUpperPitch === endUpperPitch)
                                )) {
                                    i = j - 1;
                                    break;
                                } else {
                                    activeVoice = startLowerPitch === endLowerPitch ? 'upper' : 'lower';
                                }
                            }

                            // end loop when three consecutive data records were found
                            if (dataTokenCount === 3) {
                                if (endFbToken === parallelInterval) {

                                    const mintKern = execSync(`echo ${escapeShell(createHelperScore(startLowerPitch, startUpperPitch, endLowerPitch, endUpperPitch))} | mint -d | ridxx -H`).toString().trim();
                                    const [lowerDirection, upperDirection] = mintKern.split('\n')[1].split('\t');

                                    // only catch when start and end intervals move one step up or down
                                    if (
                                        (lowerDirection === '-2' && upperDirection === '-2') ||
                                        (lowerDirection === '+2' && upperDirection === '+2')
                                    ) {

                                        const markedKernLines = execSync(`cat ${file}`).toString().trim().split('\n').map((line, lineIndex) => {
                                            const tokens = line.split('\t');
                                            return tokens.map((token, tokenIndex) => {
                                                if (
                                                    [lowerVoiceIndex, upperVoiceIndex].includes(tokenIndex) &&
                                                    tokenIsDataRecord(token) 
                                                ) {
                                                    return `${token}@`;
                                                }
                                                return token;
                                            }).join('\t');
                                        });

                                        const exampleStartLineNumber = startLineNumber;
                                        const exampleEndLineNumber = endLineNumber;

                                        // extract kern of examples for non-consecutive parallels
                                        const stdout = execSync(`echo ${escapeShell(markedKernLines.join('\n'))} | myank -I -l ${exampleStartLineNumber}-${exampleEndLineNumber} --hide-ending`).toString().trim();
                                        const exampleKernLines = stdout.split('\n');
                                        exampleKernLines.push('!!!RDF**kern: @ = marked note (non-consecutive parallels)');
                                        const exampleKern = exampleKernLines.filter(line => {
                                            // remove distracting lines
                                            return !(line.match(/^!!\s?cadence/) || line.includes('*xywh'));
                                        }).join('\n');


                                        const filename = `${uuidv5(exampleKern, UUID_NAMESPACE)}.krn`;
                                        fs.writeFileSync(`${__dirname}/../${directoryName}/${filename}`, exampleKern);

                                        const config = {
                                            filename,
                                            direction: lowerDirection === '-2' ? 'down' : 'up',
                                            interval: parseInt(parallelInterval, 10),
                                            middleInterval: parseInt(middleInterval, 10),
                                            activeVoice,
                                            startLine: startLineNumber,
                                            endLine: endLineNumber,
                                            triciniumId: id,
                                            lowerVoice: spineToVoiceName(lowerVoiceIndex + 1),
                                            upperVoice: spineToVoiceName(upperVoiceIndex + 1),
                                            startBeat: parseFloat(startBeatToken),
                                        };

                                        // save config yaml file
                                        const configFileName = `${id}-${spineToVoiceName(lowerVoiceIndex + 1)}-${spineToVoiceName(upperVoiceIndex + 1)}-${startBeatToken}.yaml`;
                                        fs.writeFileSync(`${__dirname}/../content/${directoryName}/${configFileName}`, yaml.dump(config, {
                                            indent: 4,
                                            lineWidth: -1,
                                            sortKeys: true,
                                        }));
                                    }

                                }
                                i = j - 1;
                                break;
                            }
                        }
                    }
                }
            }
        });
    });
});
