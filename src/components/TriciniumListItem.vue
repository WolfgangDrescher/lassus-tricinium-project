<script setup>
import Link from './Link.vue';
import BadgeCloud from './BadgeGroup.vue';
import Badge from './Badge.vue';

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
                        <Link :href="`/tricinium/${tricinium.id}`">
                            {{ tricinium.title }}
                        </Link>
                    </div>
                    <div class="text-sm leading-normal pt-1 text-gray-500">
                        {{ tricinium.composer }}
                    </div>
                </div>
                <div>
                    <a :href="tricinium.vhvHref" target="_blank">
                        VHV
                    </a>
                </div>
            </div>
        </div>
        <div class="px-2">
            <div v-if="tricinium.hasLyrics" class="text-sm leading-5 py-4 text-gray-600">
                {{ tricinium.lyricsAsString() }}
            </div>
            <BadgeCloud>
                <Badge text-size="sm" v-if="tricinium.transposed">Transponiert</Badge>
                <Badge text-size="sm" v-if="tricinium.finalis">{{ tricinium.finalis }}</Badge>
                <Badge text-size="sm" v-if="tricinium.mode">{{ tricinium.mode }}</Badge>
            </BadgeCloud>
        </div>
    </div>
</template>
