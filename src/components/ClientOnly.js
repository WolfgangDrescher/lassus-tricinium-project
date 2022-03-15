import { ref, onMounted, defineComponent, createElementBlock } from 'vue';

export default defineComponent({
    name: 'ClientOnly',
    setup(_, { slots }) {
        const mounted = ref(false);
        onMounted(() => {
            mounted.value = true;
        });
        return () => {
            if (mounted.value) {
                return slots.default?.();
            }
            return createElementBlock('div');
        };
    },
});
