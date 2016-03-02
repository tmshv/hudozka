let tryReplace = (dict, record, map = i=>i) =>
    record in dict ? map(dict[record]) : record;

export const autumnMonth = 8;
export const springMonth = 0;


export const populate = (dict, map) =>
    id => tryReplace(dict, id, map);

export function scheduleDate(schedule){
    let {period, semester} = schedule;

    let i = semester === 'spring' ? 1 : 0;
    let year = parseInt(
        period.split('-')[i]
    );

    return new Date(
        year,
        i ? springMonth : autumnMonth   ,
        1
    );
}
