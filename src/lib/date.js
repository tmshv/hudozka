const moment = require('moment')
moment.locale('ru')

/**
 *
 * Date -> DD.MM.YYYY
 *
 * @param date
 */
exports.dateFormat = date => moment(date).format('L')

/**
 *
 * Date -> Unix time
 *
 * @param date
 */
exports.timestamp = date => date.getTime()
