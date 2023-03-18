<template>
    <slot></slot>
</template>

<style scoped>
:slotted(:deep(code)) {
    @apply bg-[rgba(175,184,193,0.2)] rounded-md text-[80%] m-0 px-[.4em] py-[.2em];
    white-space: break-spaces;
}

:slotted(:deep(p + p)),
:slotted(p + p) {
    @apply mt-4;
}

:slotted(:deep(h3)) {
    @apply font-sans mt-6 mb-1 font-bold text-base;
}

:slotted(:deep(ul)) {
    @apply list-disc ml-8 my-3;
}

:slotted(:deep(ul)) li {
    @apply my-1;
}

:slotted(:deep(kbd)) {
    @apply inline-block text-[.85em] px-[.35em] py-[.15em] font-mono leading-3 bg-gray-100 rounded border border-gray-200;
    box-shadow: inset 0 -1px 0 var(--color-neutral-muted);
}
</style>
