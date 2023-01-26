<template>
    <slot></slot>
</template>

<style scoped>
:slotted(code) {
    @apply bg-[rgba(175,184,193,0.2)] rounded-md text-[80%] m-0 px-[.4em] py-[.2em];
    white-space: break-spaces;
}

:slotted(p + p) {
    @apply mt-4;
}
</style>
