export default defineEventHandler(async (event) => {
    const url = 'https://raw.githubusercontent.com/WolfgangDrescher/lassus-geistliche-psalmen/master/meta.json';
    return await $fetch(url, { parseResponse: JSON.parse });
})
