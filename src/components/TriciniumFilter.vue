<script setup>
defineProps({
    filter: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    {{ filter }}
    <input
        v-model="filter.nr"
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search number"
    />
    <input
        v-model="filter.title"
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search in title"
    />
    <input
        v-model="filter.lyrics"
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search in lyrics"
    />
    <select
        v-model="filter.composer"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
        <option value="Orlandus Lassus">Orlandus Lassus</option>
        <option value="Rudolphus Lassus">Rudolphus Lassus</option>
        <option value="">Both</option>
    </select>
    <select
        v-model="filter.mode"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
        <option value="">none</option>
        <option value="ionian">ionian</option>
        <option value="dorian">dorian</option>
        <option value="phrygian">phrygian</option>
        <option value="lydian">lydian</option>
        <option value="mixolydian">mixolydian</option>
        <option value="aeolian">aeolian</option>
        <option value="locrian">locrian</option>
    </select>
    <select
        v-model="filter.transposed"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
        <option value="">none</option>
        <option value="true">true</option>
        <option value="false">false</option>
    </select>
    <select
        v-model="filter.finalis"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
        <option value="">none</option>
        <option value="c">c</option>
        <option value="d">d</option>
        <option value="e">e</option>
        <option value="f">f</option>
        <option value="g">g</option>
        <option value="a">a</option>
        <option value="h">h</option>
    </select>
</template>
