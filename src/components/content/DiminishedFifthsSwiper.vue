<script setup>
import Swiper, { Virtual, Navigation, Pagination } from 'swiper';
import { breakpointsTailwind } from '@vueuse/core';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const { data } = await useAsyncData('diminished-fifths', () => queryContent('/diminished-fifths').find())

const items = toRaw(data.value);

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
        breakpoints: {
            [breakpointsTailwind.lg]: {
                spaceBetween: 32,
                slidesPerView: 2,
            },
        },
        virtual: {
            enabled: true,
            slides: items,
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

const showModernClefs = ref(false);
const showIntervallsatz = ref(false);
const hideLyrics = ref(false);

const { t } = useI18n();

const { data: triciniumData } = await useFetch('/api/tricinium');
const tricinia = useTricinium(triciniumData.value);

function getCaption(item) {
    const tricinium = tricinia.find(t => t.id === item.triciniumId);
    const location = `T. ${Math.ceil(item.beat / 8)} ♩ ${(item.beat % 8) + 1}`;
    return `${tricinium.nr}. ${tricinium.title}, ${location}`;
}
</script>

<template>
    <div class="mt-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            <FormCheckbox v-model="showModernClefs" :label="$t('showModernClefs')" />
            <FormCheckbox v-model="showIntervallsatz" :label="$t('showIntervallsatz')" />
            <FormCheckbox v-model="hideLyrics" :label="$t('hideLyrics')" />
        </div>
        <div class="relative" ref="wrapperEl">
            <div class="swiper" ref="swiperEl">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="item in virtualData.slides" :key="item._id" :style="{ left: `${virtualData.offset}px` }">
                        <DiminishedFifthItem :item="item" :show-modern-clefs="showModernClefs" :show-intervallsatz="showIntervallsatz" :hide-lyrics="hideLyrics" :caption="getCaption(item)"/>
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