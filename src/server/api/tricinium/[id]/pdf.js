import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import { VerovioToolkit } from 'verovio/esm';
import createVerovioModule from 'verovio/wasm-hum';
import { useDeferred } from '@/composables/useDeferred.js';
import { useTricinium } from '@/composables/useTricinium.js';

function verovioUnitToPoints(mm)  {
    return mm / 10 * 74 / 25.4;
}

export default defineEventHandler(async (event) => {
    const { id } = event.context.params;
    const {
        orientation,
        prefix,
        scale: scaleParam,
        verovioSpacingSystem,
        verovioSpacingStaff,
    } = getQuery(event);
    const tricinium = useTricinium(await $fetch(`/api/tricinium/${id}`));

    const response = await $fetch(`http://localhost:3000${tricinium.localRawFile}`);
    const scoreData = await response.text();
    const verovioModule = await createVerovioModule();
    const toolkit = new VerovioToolkit(verovioModule);

    const margin = 150;
    const pageWidth = orientation === 'landscape' ? 2970 : 2100;
    const pageHeight = orientation === 'landscape' ? 2100 : 2970;
    const verovioWithExtender = orientation === 'landscape' ? 82 : 55;
    const verovioPageWidth = pageWidth - margin * 2;
    const verovioPageHeight = pageHeight - margin * 2;
    const scale = scaleParam ? Math.min(150, Math.max(50, parseInt(scaleParam, 10))) : 88 || 88;

    toolkit.setOptions({
        adjustPageHeight: false,
        breaks: 'auto',
        mmOutput: true,
        pageWidth: Math.min(Math.max(verovioPageWidth * (100 / scale), 100), 60000) + verovioWithExtender,
        pageHeight: Math.min(Math.max(verovioPageHeight * (100 / scale), 100), 60000),
        pageMarginTop: 0,
        pageMarginLeft: 0,
        pageMarginRight: 0,
        pageMarginBottom: 0,
        scale,
        header: 'auto',
        footer: 'none',
        spacingSystem: verovioSpacingSystem || 24,
        spacingStaff: verovioSpacingStaff || 12,
        svgCss: '.pgHead { fill: transparent; }',
    });
    toolkit.loadData(`${prefix}\n${scoreData}`);

    const pageOptions = {
        fontCallback(family, bold, italic, fontOptions) {
            if (family.match(/(?:^|,)\s*sans-serif\s*$/) || true) {
                if (bold && italic) { return 'Times-BoldItalic'; }
                if (bold && !italic) { return 'Times-Bold'; }
                if (!bold && italic) { return 'Times-Italic'; }
                if (!bold && !italic) { return 'Times-Roman'; }
            }
        },
    };

    const streamIsFinished = useDeferred();
    const doc = new PDFDocument({
        size: [verovioUnitToPoints(pageWidth), verovioUnitToPoints(pageHeight)],
        margin: 0,
        useCSS: true,
        compress: true,
        autoFirstPage: false,
        layout: 'portrait',
        info: {
            Title: `${tricinium.nr}. ${tricinium.title}`,
            Author: 'Wolfgang Drescher',
        },
    });
    const stream = doc.pipe(event.node.res);

    for (let i = 0; i < toolkit.getPageCount(); i++) {
        doc.addPage();
        // doc.rect(verovioUnitToPoints(margin), verovioUnitToPoints(margin), verovioUnitToPoints(verovioPageWidth), verovioUnitToPoints(verovioPageHeight)).fill('lightblue');
        SVGtoPDF(doc, toolkit.renderToSVG(i + 1, {}), verovioUnitToPoints(margin), verovioUnitToPoints(margin), pageOptions);
        doc.font('Helvetica').fontSize(9).fillColor('black');
        doc.text('Lassus Tricinium Project\nhttps://lassus.mh-freiburg.de', verovioUnitToPoints(margin), verovioUnitToPoints(pageHeight) - 40, {
            width: verovioUnitToPoints(verovioPageWidth),
            align: 'left',
        });
        doc.text(`${tricinium.nr}. ${tricinium.title}\nSeite ${i +1}`, verovioUnitToPoints(margin), verovioUnitToPoints(pageHeight) - 40, {
            width: verovioUnitToPoints(verovioPageWidth),
            align: 'center',
        });
        doc.text('Prof. Wolfgang Drescher\nw.drescher@mh-freiburg.de', verovioUnitToPoints(margin), verovioUnitToPoints(pageHeight) - 40, {
            width: verovioUnitToPoints(verovioPageWidth),
            align: 'right',
        });
        if (i === 0) {
            doc.fontSize(24).fillColor('black');
            doc.text(`${tricinium.nr}. ${tricinium.title}`, verovioUnitToPoints(margin), verovioUnitToPoints(margin) - 5);
            doc.fontSize(12).fillColor('black');
            doc.text(`${tricinium.composer}`, {
                width: verovioUnitToPoints(verovioPageWidth),
                align: 'right',
            }, 65);
        }
    }

    stream.on('finish', function () {
        streamIsFinished.resolve();
    });
    doc.end();

    await streamIsFinished.promise;
});