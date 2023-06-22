<script setup>
import Swiper, { Virtual, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const props = defineProps({
    melismata: Array,
});

const wrapperEl = ref(null);
const swiperEl = ref(null);
const virtualData = ref({
    slides: [],
});

onMounted(() => {
    new Swiper(swiperEl.value, {
        // autoHeight: true,
        modules: [Virtual, Navigation, Pagination],
        spaceBetween: 16,
        slidesPerView: 1,
        virtual: {
            enabled: true,
            slides: props.melismata,
            renderExternal(data) {
                virtualData.value = data;
            },
            addSlidesBefore: 0,
            addSlidesAfter: 0,
        },
        navigation: {
            prevEl: wrapperEl.value.querySelector('.swiper-button-prev'),
            nextEl: wrapperEl.value.querySelector('.swiper-button-next'),
        },
        pagination: {
            el: wrapperEl.value.querySelector('.swiper-pagination'),
            type: 'fraction',
        },
    });
});
</script>

<template>
    <div class="relative" ref="wrapperEl">
        <div class="swiper" ref="swiperEl">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="melisma in virtualData.slides" :key="melisma.id" :style="{ left: `${virtualData.offset}px` }">
                    <MelismaListItem :melisma="melisma" />
                </div>
            </div>
        </div>
        <div class="flex items-center h-10">
            <div class="self-end">
                <div class="swiper-button-prev"></div>
            </div>
            <div class="flex-grow">
                <div class="swiper-pagination"></div>
            </div>
            <div class="self-end">
                <div class="swiper-button-next"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.swiper-pagination, 
.swiper-button-prev,
.swiper-button-next {
    @apply static;
}

.swiper-pagination {
    --swiper-theme-color: var(--color-primary-500);
}

.swiper-button-prev {
    right: auto;
    left: 0;
}

.swiper-button-next {
    left: auto;
    right: 0;
}

.swiper-button-prev,
.swiper-button-next {
    top: auto;
    bottom: 0;
    z-index: 11;
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

.swiper-pagination-lock {
    display: block;
}
</style>