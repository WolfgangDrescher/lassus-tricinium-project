import { serverQueryContent } from '#content/server';

function getIdFromPath(path) {
    return path.replace(/^.*[\\\/]/, '');
}

export default defineEventHandler(async (event) => {
    const { id } = event.context.params;
    const tricinium = await serverQueryContent(event).where({
        _source: 'lgp',
        _path: {
            $contains: `/lgp/${id}`,
        },
    }).findOne();
    if (tricinium) {
        const [prev, next] = await serverQueryContent(event).where({
            _source: 'lgp',
        }).findSurround(tricinium._path);
        tricinium['@prev'] = prev ? getIdFromPath(prev._path) : null;
        tricinium['@next'] = next ? getIdFromPath(next._path) : null;
    }
    return tricinium;
});