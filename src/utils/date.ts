import { range } from 'lodash'

export function getDates(start: Date) {
    const oneDay = (1000 * 60 * 60 * 24);
    const startTime = start.getTime();
    const startDay = start.getDay();

    return range(0, 6)
        .reduce((dates, weekDay) => {
            let delta = 1 + weekDay - startDay;
            let time = startTime + (oneDay * delta);

            return dates.concat([new Date(time)]);
        }, [])
        .map(i => i.getDate());
}
