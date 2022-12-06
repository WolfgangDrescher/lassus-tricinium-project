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

execSync(`rm -rf ${__dirname}/../content/cadences/*`);
execSync(`rm -rf ${__dirname}/../cadences/*`);


getFiles(`${__dirname}/../lassus-geistliche-psalmen/kern`).forEach(file => {
    const id = getIdFromFilename(file);
    const kern = fs.readFileSync(file, 'utf8');
    const findCadenceStartRegex = /^!!\s?cadence\sstart([^\n]?[\w])?([^\n]?;[^\n]?ultima[^\n]?=[^\n]?(\w+))?/gm;
    const findCadenceEndRegex = /^!!\s?cadence\send([^\n]?[\w])?([^\n]?;[^\n]?ultima[^\n]?=[^\n]?(\w+))/gm;

    let startResult;
    let endResult;
    let counter = 0;

    while ((startResult = findCadenceStartRegex.exec(kern)) !== null) {
        while ((endResult = findCadenceEndRegex.exec(kern)) !== null) {
            if (startResult.index < endResult.index && startResult[1] === startResult[1]) {
                counter++;
                // yank score
                const startLine = kern.substring(0, startResult.index).split('\n').length;
                const ultima = (startResult[3] ?? endResult[3])?.toLowerCase();
                const endLine = kern.substring(0, endResult.index).split('\n').length;
                const stdout = execSync(`yank -c -l -r ${startLine}-${endLine} ${file}`).toString();
                const cadenceFileLines = stdout.split('\n').filter(line => {
                    return !(line.match(/^!!\s?cadence/) || line.includes('*xywh'));
                });
                const fileContent = cadenceFileLines.join('\n');
                const cadenceFilename = `${uuidv5(fileContent, UUID_NAMESPACE)}.krn`;
                fs.writeFileSync(`${__dirname}/../cadences/${cadenceFilename}`, fileContent);

                // set yaml config
                const config = {
                    triciniumId: id,
                    filename: cadenceFilename,
                    ultima: ultima ?? null,
                };
                const configFileName = `${id}-${startLine}.yaml`;
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
