<script setup>
import Swiper, { Navigation, Mousewheel } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({
    items: Object,
});

const selectedTab = ref(props.items[0].value);

const tabNav = ref();

onMounted(() => {
    const hash = typeof location !== 'undefined' && location.hash ? location.hash.split('#')[1] : null;
    if(hash && props.items.map(item => item.value).includes(hash)) {
        selectedTab.value = hash;
    }
    new Swiper(tabNav.value, {
        modules: [Navigation, Mousewheel],
        spaceBetween: 16,
        slidesPerView: 'auto',
        navigation: {
            prevEl: tabNav.value.querySelector('.swiper-button-prev'),
            nextEl: tabNav.value.querySelector('.swiper-button-next'),
        },
        mousewheel: {
            forceToAxis: true,
        },
    });
});
</script>

<template>
    <div>
        <div class="border-b border-gray-200">
            <div class="swiper" ref="tabNav">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="item in items" :key="item.value">
                        <TabPill :hash="item.value" @click="selectedTab = item.value" :active="selectedTab === item.value">{{ item.text }}</TabPill>
                    </div>
                </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
        <div class="py-4">
            <template v-for="item in items" :key="item.value">
                <div v-if="selectedTab === item.value">
                    <slot :name="`tabItem.${item.value}`"></slot>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.swiper {
    --swiper-theme-color: var(--color-primary-500);
    --swiper-navigation-size: 1rem;
    @apply relative;
}

.swiper-slide {
    @apply w-auto;
}

.swiper-button-prev,
.swiper-button-next {
    --angle: 0deg;
    @apply h-full top-0 mt-0 w-8;
    background: rgb(255,255,255);
    background: linear-gradient(var(--angle), rgba(255,255,255,0) 0%, rgba(255,255,255,1) 65%);
}

.swiper-button-prev {
    --angle: -90deg;
    @apply left-0 justify-start;
}

.swiper-button-next {
    --angle: 90deg;
    @apply right-0 justify-end;
}

.swiper-button-disabled {
    @apply opacity-0;
}
</style>