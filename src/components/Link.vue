<template>
    <a :href="href" :class="{ active: pageContext.urlPathname === $attrs.href }">
        <slot />
    </a>
</template>

<style scoped>

a {
    padding: 3px 10px;
}
a.active {
    background-color: #eee;
}
</style>
<script setup>
import { usePageContext } from '../composables/usePageContext';
const pageContext = usePageContext();
</script>
