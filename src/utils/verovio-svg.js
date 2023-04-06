export function selectBBoxElem(elem, selectors) {
    const selectedElem = elem?.querySelector(selectors);
    return getBBoxElem(selectedElem);
}

export function getBBoxElem(elem) {
    return elem?.closest('svg')?.querySelector(`#bbox-${elem?.id} rect`) ?? elem;
}