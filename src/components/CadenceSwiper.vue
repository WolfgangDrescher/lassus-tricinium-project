<script setup>
import Swiper, { Virtual, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const props = defineProps({
    cadences: Array,
});

const wrapperEl = ref(null);
const swiperEl = ref(null);
const virtualData = ref({
    slides: [],
});

onMounted(() => {
    new Swiper(swiperEl.value, {
        modules: [Virtual, Navigation, Pagination],
        spaceBetween: 16,
        slidesPerView: 1,
        breakpoints: {
            1024: {
                slidesPerView: 2,
            },
        },
        virtual: {
            enabled: true,
            slides: props.cadences,
            renderExternal(data) {
                virtualData.value = data;
            },
            addSlidesBefore: 1,
            addSlidesAfter: 1,
        },
        navigation: {
            prevEl: wrapperEl.value.querySelector('.swiper-button-prev'),
            nextEl: wrapperEl.value.querySelector('.swiper-button-next'),
        },
        pagination: {
            el: wrapperEl.value.querySelector('.swiper-pagination'),
            type: 'bullets',
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
        },
    });
});
</script>

<template>
    <div class="relative pb-8" ref="wrapperEl">
        <div class="swiper" ref="swiperEl">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="cadence in virtualData.slides" :key="cadence.id" :style="{ left: `${virtualData.offset}px` }">
                    <CadenceListItem :cadence="cadence" />
                </div>
            </div>
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-next"></div>
    </div>
</template>

<style scoped>
.swiper-button-prev {
    right: calc(100% + 1rem);
    left: auto;
}

.swiper-button-next {
    left: calc(100% + 1rem);
    right: auto;
}

.swiper-button-prev,
.swiper-button-next {
    @apply rounded-full w-10 h-10;
    background-color: var(--color-primary-500);
    --swiper-navigation-color: white;
}

.swiper-button-disabled {
    display: none;
}

.swiper-button-prev::after,
.swiper-button-next::after {
    @apply text-base;
}
.swiper-slide :deep(> div) {
    @apply m-2;
}
</style>