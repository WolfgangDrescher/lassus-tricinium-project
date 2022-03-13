import * as Diff from 'diff';

function getLinePrefix(line) {
    if (line.added) return '+';
    if (line.removed) return '-';
    return ' ';
}

function numberOfLines(str) {
    return str.split(/\n/).length;
}

function getGitDiffString(a, b) {
    return Diff.diffLines(a, b).map((line) => {
        const prefix = getLinePrefix(line);
        return `${prefix}${line.value.replace(/(?:\n)([^\n])/g, `\n${prefix}$1`)}`;
    }).join('');
}

export function useDiffToGitDiff(a, b, fileName) {
    return `--- a/${fileName}
+++ b/${fileName}
@@ -1,${numberOfLines(a)} +1,${numberOfLines(b)} @@
${getGitDiffString(a, b)}`;
}
