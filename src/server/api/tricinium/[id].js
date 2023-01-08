import { serverQueryContent } from '#content/server';

export default defineEventHandler(async (event) => {
    const { id } = event.context.params;
    return await serverQueryContent(event).where({
        _source: 'lgp',
        _path: `/lgp/${id}`,
    }).findOne();
});
