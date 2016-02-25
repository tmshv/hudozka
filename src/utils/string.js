/**
 * Return a function that accept one String parameter and returns result of replacing.
 *
 * @param searchValue
 * @param replaceValue
 */
export const stringReplace = (searchValue, replaceValue) =>
    str => str.replace(searchValue, replaceValue);
