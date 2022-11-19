<script setup>
defineProps({
    tricinium: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div class="p-6 shadow border border-gray-100 rounded">
        <div class="flex items-center border-b border-gray-200 pb-6">
            <div class="w-12 h-12 flex justify-center items-center font-serif text-4xl">
                {{ tricinium.nr }}.
            </div>
            <div class="flex items-start justify-between w-full">
                <div class="pl-3 w-full">
                    <div class="text-xl font-medium leading-5 text-gray-800">
                        <NuxtLink :href="`/tricinium/${tricinium.id}`">
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
        <div class="px-2">
            <div v-if="tricinium.hasLyrics" class="text-sm leading-5 py-4 text-gray-600">
                {{ tricinium.lyricsAsString() }}
            </div>
            <BadgeGroup>
                <Badge text-size="sm" v-if="tricinium.transposition">{{ $t(`transposition.${tricinium.transposition}`) }}</Badge>
                <Badge text-size="sm" v-if="tricinium.finalis">{{ tricinium.finalis }}</Badge>
                <Badge text-size="sm" v-if="tricinium.mode">{{ $t(`mode.${tricinium.mode}`) }}</Badge>
            </BadgeGroup>
        </div>
    </div>
</template>
