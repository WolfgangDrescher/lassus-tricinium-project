import * as Diff from 'diff';

function getLinePrefix(line) {
    if (line.added) return '+';
    if (line.removed) return '-';
    return ' ';
}

function trimNewLine(str) {
    return str?.replace(/^\s+|\s+$/g, '') || null;
}

function numberOfLines(str) {
    return trimNewLine(str)?.split(/\n/).length || 0;
}

function getGitDiffString(a, b) {
    return Diff.diffLines(a, b).map((line) => {
        const prefix = getLinePrefix(line);
        return `${prefix}${line.value.replace(/(?:\n)([^\n])/g, `\n${prefix}$1`)}`;
    }).join('');
}

export function useDiffToGitDiff(a, b, fileName) {
    a = `${trimNewLine(a)}\n`;
    b = `${trimNewLine(b)}\n`;
    return `--- a/${fileName}
+++ b/${fileName}
@@ -1,${numberOfLines(a)} +1,${numberOfLines(b)} @@
${getGitDiffString(a, b)}`;
}
