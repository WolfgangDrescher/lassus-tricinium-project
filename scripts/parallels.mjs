import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const files = getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`);

const voicePairs = [
    '1,3',
    '1,5',
    '3,5',
];

files.forEach(file => {
    const id = getIdFromFilename(file);
    console.log(id);

    voicePairs.forEach(voicePair => {
        // voice exchange will be ignored
        const kern = execSync(`cat ${file} | extractxx -f ${voicePair} | fb -cm | fb -m`).toString().trim();
        const lines = kern.split('\n');
        ['5', '8'].forEach(parallelInterval => {
            for (let i = 0; i < lines.length; i++) {
                const startLine = lines[i];
                const startKernTokenLower = startLine.split('\t')[0];
                const startFbToken = startLine.split('\t')[1];
                const startFbNonCompoundToken = startLine.split('\t')[2];
                const startKernTokenUpper = startLine.split('\t')[3];
                if (tokenIsDataRecord(startFbToken, true) && startFbToken === parallelInterval) {
                    const startLineNumber = i + 1;
                    let endLineNumber = i + 1;
                    for (let j = i + 1; j < lines.length; j++) {
                        const endLine = lines[j];
                        const endKernTokenLower = endLine.split('\t')[0];
                        const endFbToken = endLine.split('\t')[1];
                        const endFbNonCompoundToken = endLine.split('\t')[2];
                        const endKernTokenUpper = endLine.split('\t')[3];
                        if (tokenIsDataRecord(endFbToken, true)) {
                            if (endKernTokenLower === '.' && endKernTokenUpper === '.') {
                                continue;
                            }
                            
                            const startLowerPitch = getTokenPitch(i, 0, lines);
                            const startUpperPitch = getTokenPitch(i, 3, lines);
                            const endLowerPitch = getTokenPitch(j, 0, lines);
                            const endUpperPitch = getTokenPitch(j, 3, lines);

                            if (
                                endFbToken !== parallelInterval ||
                                (startLowerPitch === endLowerPitch && startUpperPitch === endUpperPitch) ||
                                ((startLowerPitch === endLowerPitch || startUpperPitch === endUpperPitch) && parseInt(endFbToken, 10) % 7 === parseInt(endFbNonCompoundToken, 10) % 7) ||
                                false
                            ) {
                                break;
                            }

                            const mintKern = execSync(`echo ${escapeShell(createHelperScore(startLowerPitch, startUpperPitch, endLowerPitch, endUpperPitch))} | mint | ridxx -H`).toString().trim();
                            const [lowerDirection, upperDirection] = mintKern.split('\n')[1].split('\t').map(token => token.replace(/^([+-]).+$/, '$1'))

                            if (lowerDirection !== upperDirection) {
                                break;
                            }

                            endLineNumber = j + 1;

                            console.log({
                                startLowerPitch,
                                startUpperPitch,
                                endLowerPitch,
                                endUpperPitch,
                                startLineNumber,
                                startLine,
                                endLineNumber,
                                endLine,
                                parallelInterval,
                                voicePair
                            });

                            i = endLineNumber - 1;
                            break;
                        }
                    }
                }
            }
        });
    });
});