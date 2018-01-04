export const autumnMonth = 8;
export const springMonth = 0;

export function scheduleDate(schedule){
    let {period, semester} = schedule;

    let i = semester === 'spring' ? 1 : 0;
    let year = getPeriod(period)[i];

    return new Date(
        year,
        i ? springMonth : autumnMonth,
        1
    );
}

/**
 *
 * f("2012-2015") -> [2012, 2015]
 * f(["2012", "2015"]) -> [2012, 2015]
 * f([2012, 2015]) -> [2012, 2015]
 *
 * @param i
 * @returns {*}
 */
export function getPeriod(i){
    if (typeof i === 'string') return getPeriod(i.split('-'));

    return i.map(Number);
}

/**
 *
 * f("2012-2015") -> "2012-2015"
 * f(["2012", "2015"]) -> "2012-2015"
 * f([2012, 2015]) -> "2012-2015"
 *
 * @param i
 * @returns {*}
 */
function getPeriodString(i) {
	return getPeriod(i)
		.join('-')
}

exports.getPeriodString = getPeriodString
