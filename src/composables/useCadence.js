export function useCadence(elements, tricinia) {
    console.log(elements, tricinia);
    if (Array.isArray(elements)) {
        return elements.map(elem => createCadence(elem, findTricinium(tricinia, elem.triciniumId)));
    } else if (typeof elements === 'object' && elements !== null) {
        return createCadence(elements, tricinia);
    }
    throw new Error('Cannot convert passsed arguments to cadence object');
}

function createCadence(cadence, tricinium) {
    console.log(cadence.triciniumId, tricinium);
    return Object.assign({}, cadence, {
        tricinium: tricinium,
    });
}

function findTricinium(tricinia, id) {
    return tricinia.find(t => t.id === id);
}
