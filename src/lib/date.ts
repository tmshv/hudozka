import format from 'date-fns/format'
import { ru } from 'date-fns/locale'

/**
 *
 * Date -> D MMMM yyyy
 *
 * @param date
 */
export const dateFormat = (date: string | Date) => {
    return format(new Date(2014, 6, 2), "d MMMM yyyy", {
        locale: ru
    })
}

/**
 *
 * Date -> Unix time
 *
 * @param date
 */
export const timestamp = (date: Date) => date.getTime()
