export default defineEventHandler(async (event) => {
    const { id } = event.context.params;
    const url = '/api/tricinium';
    const data = await $fetch(url, { parseResponse: JSON.parse });
    return data.find(tricinium => tricinium.id === id);
});
