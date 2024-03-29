<script setup>
const props = defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
    scoreDisplay: {
        type: String,
        default: 'lassus',
    },
    showLyrics: {
        type: Boolean,
        default: true,
    },
});

const localePath = useLocalePath();

async function navigateToTricinium() {
    return await navigateTo(localePath({ name: 'tricinium-id', params: { id: props.tricinium.id } }));
}

const filter = useTriciniumFilterStore();

function updateFilter(prop, value) {
    filter.update(prop, value);
}
</script>

<template>
    <Card>
        <template v-slot:title>
            <div class="flex items-center">
                <div class="w-12 h-12 flex justify-center items-center font-serif text-4xl cursor-pointer hover:text-primary-500" @click="navigateToTricinium">
                    {{ tricinium.nr }}.
                </div>
                <div class="flex items-start justify-between w-full">
                    <div class="pl-3 w-full">
                        <div class="text-xl font-medium leading-5 text-gray-800 hover:text-primary-500">
                            <NuxtLink :to="localePath({ name: 'tricinium-id', params: { id: tricinium.id } })">
                                {{ tricinium.title }}
                            </NuxtLink>
                        </div>
                        <div class="text-sm leading-normal pt-1 text-gray-500">
                            {{ tricinium.composer }}
                        </div>
                    </div>
                    <div>
                        <a :href="tricinium.vhvHref" target="_blank" title="Verovio Humdrum Viewer">
                            VHV
                        </a>
                    </div>
                </div>
            </div>
        </template>
        <div class="flex flex-col gap-4 mt-4">
            <div v-if="scoreDisplay === 'lassus' && tricinium.localRawFile" @click="navigateToTricinium" class="cursor-pointer">
                <VerovioCanvas :url="tricinium.localRawFile" :select="{measureRange: '1-4'}" view-mode="horizontal" :scale="35" lazy unload :lazy-delay="100" :options="{ pageMarginBottom: 30 }" />
            </div>
            <div v-else-if="scoreDisplay === 'ulenberg'" @click="navigateToTricinium" class="cursor-pointer">
                <VerovioCanvas :url="tricinium.localUlenbergRawFile" view-mode="horizontal" :scale="35" lazy :options="{ pageMarginBottom: 30 }" />
            </div>
            <div v-if="showLyrics && tricinium.hasLyrics" class="text-sm leading-5 text-gray-600">
                {{ tricinium.lyricsAsString() }}
            </div>
            <BadgeGroup>
                <Badge text-size="sm" v-if="tricinium.transposition" clickable @click="updateFilter('transposition', filter.transposition === tricinium.transposition ? null : tricinium.transposition)" :selected="filter.transposition === tricinium.transposition">
                    {{ $t(`transposition.${tricinium.transposition}`) }}
                </Badge>
                <Badge text-size="sm" v-if="tricinium.finalis" clickable @click="updateFilter('finalis', filter.finalis.includes(tricinium.finalis) ? filter.finalis.filter(f => f !== tricinium.finalis) : [tricinium.finalis])" :selected="filter.finalis.includes(tricinium.finalis)">
                    {{ tricinium.finalis }}
                </Badge>
                <Badge text-size="sm" v-if="tricinium.mode" clickable @click="updateFilter('modes', filter.modes.includes(tricinium.mode) ? filter.modes.filter(m => m !== tricinium.mode) : [tricinium.mode])" :selected="filter.modes.includes(tricinium.mode)">
                    {{ $t(`mode.${tricinium.mode}`) }}
                </Badge>
            </BadgeGroup>
        </div>
    </Card>
</template>
