import moment from 'moment'
moment.locale('ru')

/**
 *
 * Date -> DD.MM.YYYY
 *
 * @param date
 */
export const dateFormat = (date: string | Date) => moment(date).format('L')

/**
 *
 * Date -> Unix time
 *
 * @param date
 */
export const timestamp = (date: Date) => date.getTime()
