
export default defineComponent({
    name: 'NoteHighlight',
    props: {
        elem: SVGGElement,
        container: HTMLElement,
    },
    setup(props) {
        const elem = props.elem.querySelector('.notehead') || props.elem;
        const elemRect = elem.getBoundingClientRect();
        const parentRect = props.container.getBoundingClientRect();

        const markerSize = 50;

        const widthExtender = 10;
        const width = props.elem.classList.contains('verse') ? elemRect.width + widthExtender : markerSize;

        const position = reactive({
            width: `${width}px`,
            height: `${markerSize}px`,
            left: `${elemRect.x + elemRect.width / 2 - parentRect.x}px`,
            top: `${elemRect.y + elemRect.height / 2 - parentRect.y}px`,
        });

        return () => h('div', {
            style: position,
            class: [
                'bg-opacity-50 absolute -translate-x-1/2 -translate-y-1/2 bg-yellow-500',
                props.elem.classList.contains('verse') ? 'rounded' : 'rounded-full',
            ],
        });
    },
});