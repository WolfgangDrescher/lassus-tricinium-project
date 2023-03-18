
export default defineComponent({
    name: 'NoteHighlight',
    props: {
        noteId: String,
        container: HTMLElement,
    },
    setup(props) {
        const selector = `g#note-${props.noteId}, g#rest-${props.noteId}, g#mrest-${props.noteId}, g#verse-${props.noteId}`;
        let elem = props.container.querySelector(selector);

        if (!elem) return () => h('div');

        elem = elem.querySelector('.notehead') || elem;

        const elemRect = elem.getBoundingClientRect();
        const parentRect = props.container.getBoundingClientRect();
        const markerSize = 50;
        const widthExtender = 10;
        const width = elem.classList.contains('verse') ? elemRect.width + widthExtender : markerSize;

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
                elem?.classList.contains('verse') ? 'rounded' : 'rounded-full',
            ],
        });
    },
});