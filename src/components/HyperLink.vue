<template>
    <a v-bind="{...$props, ...$attrs}" class="text-primary-500 underline">
        <slot></slot>
    </a>
</template>
