import fs from 'node:fs';
import { execSync } from 'node:child_process';
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

const files = getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`);

execSync(`mkdir -p ${__dirname}/../content/chords/`);

files.forEach(file => {
    const id = getIdFromFilename(file);
    const kern = execSync(`cat ${file} | fb -conl | extractxx -f 3 | ridxx -LGIMd`).toString().trim();
    const lines = kern.split('\n');
    const chordMap = {};
    lines.forEach(line => {
        chordMap[line] = chordMap[line] ?? 0;
        chordMap[line] += 1;
    });

    fs.writeFileSync(`${__dirname}/../content/chords/${id}.yaml`, yaml.dump(chordMap, {
        indent: 4,
        lineWidth: -1,
        sortKeys: true,
    }));

});
