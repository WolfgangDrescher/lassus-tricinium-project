<template>
    <NuxtLink v-bind="{ ...$props, ...$attrs }" class="text-primary-500 underline">
        <slot></slot>
    </NuxtLink>
</template>
