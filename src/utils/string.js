import {map} from './common';

/**
 * Return a function that accept one String parameter and returns result of replacing.
 *
 * @param searchValue
 * @param replaceValue
 */
export const stringReplace = (searchValue, replaceValue) =>
    str => str.replace(searchValue, replaceValue);

let toTrue = map(true, i => i === 'true');
let toFalse = map(false, i => i === 'false');
const boolProcessors = [toTrue, toFalse];

export function stringToBoolean(string){
    return boolProcessors
        .reduce(
            (value, fn) => fn(value),
            string
        );
}