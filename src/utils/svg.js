import { easeQuadOut } from 'd3-ease';

export function areNodesSame(a, b) {
    return a.data.id === b.data.id;
}

export function areLinksSame(a, b) {
    return a.source.data.id === b.source.data.id && a.target.data.id === b.target.data.id;
}

export function calculateNewValue(start, end, interval) {
    return start + (end - start) * easeQuadOut(interval);
}
