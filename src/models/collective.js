export function shortifyName(name) {
    let $ = i => i.replace(/^(.).+/, '$1');
    let [_, first, middle, last] = splitName(name);
    return `${$(first)}. ${$(middle)}. ${last}`;
}

export function splitName(name) {
    return /(.+)\s(.+)\s(.+)/.exec(name);
}