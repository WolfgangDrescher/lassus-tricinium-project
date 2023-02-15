import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

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

execSync(`rm -f ${__dirname}/../content/mint.yaml`);

const voiceMap = [
    { spine: 1, name: 'bassus' },
    { spine: 3, name: 'tenor' },
    { spine: 5, name: 'cantus' },
];

const directions = {};

getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`).forEach(file => {
    const id = getIdFromFilename(file);
    console.log(id);
    voiceMap.forEach((voice) => {
        const mintKern = execSync(`cat ${file} | extractxx -f ${voice.spine} | mint`).toString();
        const mintKernLines = mintKern.split('\n');
        mintKernLines.forEach((line, lineIndex) => {
            if (line.startsWith('+') || line.startsWith('-') || line.match(/^[APd]+1$/)) {
                const interval = line;
                if (!Array.isArray(directions[interval])) {
                    directions[interval] = [];
                }
                let prevIsRest = null;
                for (let i = lineIndex - 1; i >= 0; i--) {
                    const prevLine = mintKernLines[i];
                    if (prevLine.startsWith('+') || prevLine.startsWith('-') || prevLine.match(/^[APd]+1$/)) {
                        prevIsRest = false;
                        break;
                    }
                    if (prevLine === 'r') {
                        prevIsRest = true;
                        break;
                    }
                }
                let next = null;
                for (let i = lineIndex + 1; i < mintKernLines.length; i++) {
                    const nextLine = mintKernLines[i];
                    if (nextLine.startsWith('+') || nextLine.startsWith('-') || nextLine === 'r' || nextLine.match(/^[APd]+1$/)) {
                        next = nextLine;
                        break;
                    }
                }
                if (!prevIsRest) {
                    directions[interval].push({
                        triciniumId: id,
                        lineIndex,
                        next,
                        spine: voice.spine,
                    });
                }
            }
        });
    });
    fs.writeFileSync(`${__dirname}/../content/mint.yaml`, yaml.dump(directions, {
        indent: 4,
        lineWidth: -1,
        sortKeys: true,
    }));
});
