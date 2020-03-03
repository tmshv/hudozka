import format from 'date-fns/format'
import { ru } from 'date-fns/locale'

/**
 *
 * Date -> D MMMM yyyy
 *
 * @param date
 */
export const dateFormat = (date: string | Date) => {
    const value = typeof date === 'string' ? new Date(date) : date
    return format(value, "d MMMM yyyy", {
        locale: ru
    })
}
