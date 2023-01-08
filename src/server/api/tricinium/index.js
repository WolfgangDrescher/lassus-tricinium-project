import { serverQueryContent } from '#content/server';

export default defineEventHandler(async (event) => {
    return await serverQueryContent(event).where({ _source: 'lgp'}).find();
});
