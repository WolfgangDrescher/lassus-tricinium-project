function createMarker(startElem, endElem, systemElem, containerElem) {

    const systemFirstMeasureStaffRect = systemElem.querySelector('.measure .staff')?.getBoundingClientRect();
    const systemRect = systemElem.getBoundingClientRect();
    const containerRect = containerElem.getBoundingClientRect();
    const startRect = startElem?.getBoundingClientRect();
    const endRect = endElem?.getBoundingClientRect();

    const heightExtender = 10;
    const height = systemRect.height + heightExtender;

    const xPosStart = startRect ? startRect.x : (systemFirstMeasureStaffRect ? systemFirstMeasureStaffRect.x: systemRect.x);
    const xPosEnd = endRect ? endRect.right : systemRect.right;

    const widthExtender = 10;
    const width = xPosEnd - xPosStart + widthExtender;
    const xOffset = 0;

    return h('div', {
        class: [
            'bg-opacity-30 absolute bg-yellow-500 ',
            !startElem && 'bg-zig-zag-left',
            !endElem && 'bg-zig-zag-right',
            startElem && !endElem && 'rounded-tl rounded-bl',
            !startElem && endElem && 'rounded-tr rounded-br',
            startElem && endElem && 'rounded',
        ],
        style: {
            '--zig-zag-color': 'rgb(234 179 8 / 0.3)',
            width: `${width}px`,
            height: `${height}px`,
            left: `${xPosStart - (widthExtender / 2) - containerRect.x + xOffset}px`,
            top: `${systemRect.y - (heightExtender / 2) - containerRect.y}px`,
        },
    });
}

export default {
    name: 'CadenceHighlight',
    props: {
        cadence: Object,
        container: HTMLElement,
    },
    setup(props) {

        const markers = [];

        let startElem = null;
        let endElem = null;
        const containerElem = props.container;

        for (let i = props.cadence.startLine; i <= props.cadence.endLine; i++) {
            startElem = props.container?.querySelector(`g[id^="note-L${i}"]`);
            if (startElem) break;
        }

        for (let i = props.cadence.endLine; i >= props.cadence.startLine; i--) {
            endElem = props.container?.querySelector(`g[id^="note-L${i}"]`);
            if (endElem) break;
        }
        
        if (startElem && endElem && containerElem) {
            
            const startSystem = startElem.closest('g.system');
            const endSystem = endElem.closest('g.system');

            if (startSystem === endSystem) {
                markers.push(createMarker(startElem, endElem, startSystem, containerElem));
            } else {
                const systemParentChildren = startSystem.parentElement.children;
                const startIndex = [...systemParentChildren].indexOf(startSystem);
                const endIndex = [...systemParentChildren].indexOf(endSystem);

                for (let i = startIndex; i <= endIndex; i++) {
                    const systemElem = systemParentChildren[i];
                    markers.push(createMarker(
                        i === startIndex ? startElem : null,
                        i === endIndex ? endElem : null,
                        systemElem,
                        containerElem
                    ));
                }
                console.log('MULTIPLE STAFFS', startElem, endElem);
            }
        }

        return () => h('div', {}, markers);
    },
};