<script>
export default {
    inheritAttrs: false,
};
</script>

<template>
    <li>
        <NuxtLink
            v-bind="{ ...$props, ...$attrs }"
            class="block text-gray-700 border-b border-gray-100 hover:bg-primary-500 rounded hover:text-white px-3 py-1 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            :class="{ active: $route.fullPath === $attrs.href }"
        >
            <slot></slot>
        </NuxtLink>
    </li>
</template>

<style scoped>
a.active {
    @apply text-primary-500;
}

a.active:hover {
    @apply text-white;
}

@screen md {
    a.active:hover {
        @apply text-primary-700;
    }
}
</style>
