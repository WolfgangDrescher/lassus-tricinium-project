<script setup>
import { usePageContext } from '../composables/usePageContext';
import Link from './Link.vue';
const pageContext = usePageContext();
</script>

<template>
    <li>
        <Link
            v-bind="{ ...$attrs }"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            :class="{ active: pageContext.urlPathname === $attrs.href }"
        >
            <span class="flex-1 ml-3 whitespace-nowrap">
                <slot></slot>
            </span>
        </Link>
    </li>
</template>
