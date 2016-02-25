let tryReplace = (dict, record, map = i=>i) =>
    record in dict ? map(dict[record]) : record;

export const populate = (dict, map) =>
    id => tryReplace(dict, id, map);