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
</style>
