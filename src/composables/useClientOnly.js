import { h, defineComponent } from 'vue';

const isBrowser = typeof window !== 'undefined';

export function useClientOnly(asyncComponent) {
    return defineComponent({
        name: 'ClientOnly',
        setup(props, context) {
            return () => isBrowser ? h(asyncComponent, { ...props, ...context.attrs }) : h('div');
        },
    });
};
