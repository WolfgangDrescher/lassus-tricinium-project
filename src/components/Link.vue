<template>
    <a v-bind="{ ...$props, ...$attrs }">
        <slot></slot>
    </a>
</template>
