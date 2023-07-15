<script setup>
const localePath = useLocalePath();
</script>

<template>
    <footer class="py-6 md:py-12 bg-primary-500 text-white bg-pattern">
        <Container>
            <div class="grid md:grid-cols-3 gap-4">
                <div>
                    <h4 class="text-lg font-bold mb-2">Sitemap</h4>
                    <ul class="grid grid-cols-2 gap-x-2">
                        <li>
                            <NuxtLink :href="localePath('index')">{{ $t('home') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :href="localePath('about')">{{ $t('about') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :href="localePath('tricinium')">{{ $t('tricinia') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :href="localePath('cadences')">{{ $t('cadences') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :href="localePath('statistics')">{{ $t('statistics') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :href="localePath('critical-report')">{{ $t('criticalReport') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :href="localePath('learn')">{{ $t('learn') }}</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div></div>
                <div>
                    <h4 class="text-lg font-bold mb-2">Sitemap</h4>
                    <ul class="grid grid-cols-2 gap-x-2">
                        <li>
                            <NuxtLink :href="localePath('legal-notice')">{{ $t('legalNotice') }}</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </Container>
    </footer>
</template>
