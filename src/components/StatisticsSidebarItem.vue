<template>
    <li>
        <NuxtLink
            v-bind="{ ...$attrs }"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            :class="{ active: $route.fullPath === $attrs.href }"
        >
            <span class="flex-1 ml-3 whitespace-nowrap">
                <slot></slot>
            </span>
        </NuxtLink>
    </li>
</template>
