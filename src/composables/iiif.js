export function useIiif(scoreData, iiifManifestUrl) {
    const lookupMap = [];
    const fetchManifestPromise = $fetch(iiifManifestUrl);

    function getPrevXywh(lineIndex, fieldIndex) {
        for (let i = lineIndex - 1; i >= 0; i--) {
            const value = lookupMap[i]?.[fieldIndex];
            if (value) {
                return value;
            }
        }
        return null;
    }

    scoreData.split('\n').forEach((line, lineIndex) => {
        const fields = [];
        line.split('\t').forEach((field, fieldIndex) => {
            const xywh = field.startsWith('*xywh') ? field : getPrevXywh(lineIndex, fieldIndex);
            fields.push(xywh);
        });
        lookupMap.push(fields);
    });

    async function getResourceUrl(canvasIndex) {
        const response = await fetchManifestPromise;
        return response.sequences?.[0]?.canvases?.[canvasIndex]?.images?.[0]?.resource?.['@id'];
    }

    function getElementTokenPosition(elem) {
        const matches = elem.id.match(/-.*L(\d+).*F(\d+)/);
        return {
            line: matches ? parseInt(matches[1], 10) : null,
            field: matches ? parseInt(matches[2], 10) : null,
        };
    }

    function getXywhParts(lineIndex, fieldIndex) {
        const xywhToken = lookupMap[lineIndex]?.[fieldIndex] || '';
        let xywhMatches = xywhToken.match(/^\*xywh-([^:]+):(.*)$/);
        return {
            label: xywhMatches ? xywhMatches[1] : null,
            xywh: xywhMatches ? xywhMatches[2] : null,
        };
    }

    function getXywhPartsForElement(elem) {
        const { line, field } = getElementTokenPosition(elem);
        return getXywhParts(line - 1, field - 1);
    }

    function getCanvasIndexByXywhLabel(label) {
        const matches = label.match(/^#(\d+)/);
        return matches[1] - 1;
    }

    async function getResourceUrlForElement(elem) {
        const {label} = getXywhPartsForElement(elem);
        return await getResourceUrl(getCanvasIndexByXywhLabel(label))
    }

    async function openPopup(elem) {
        const { xywh } = getXywhPartsForElement(elem);
        if (!xywh) return;
        const resourceUrlBase = (await getResourceUrlForElement(elem)).replace(/\/?full.*\.jpg$/, '');
        const imageUrl = `${resourceUrlBase}/${xywh}/full/0/default.jpg`;

        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const maxScreenHeightFactor = 0.25; 
        const dimensions = xywh.match(/(\d+),(\d+),(\d+),(\d+)/);
        if (!dimensions) return;

        let width = dimensions[3];
        let height = dimensions[4]

        const aspect = width / height;
        width = Math.min(screenWidth, width);
        height = Math.min(screenHeight * maxScreenHeightFactor, height)
        const newAspect = width / height;
        if (newAspect > aspect) {
            width = height * aspect;
        } else if (newAspect < aspect) {
            height = width / aspect;
        }
        const top = screenHeight - height;
        const left = (screenWidth - width) / 2;
        window.open(imageUrl, '_blank', `popup,width=${width},height=${height},top=${top},left=${left}`);
    }

    async function openFullResourcePopup(elem) {
        const resourceUrl = await getResourceUrlForElement(elem)
        if (!resourceUrl) return;
        window.open(resourceUrl, '_blank', 'popup');
    }

    return {
        openPopup,
        openFullResourcePopup,
    }
}