export default function(app) {
    app.filter('bytes', () => {
        return (bytes, precision=1) => {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '';

            const units = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ'];
            const number = Math.floor(Math.log(bytes) / Math.log(1024));

            const size = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);
            return `${size} ${units[number]}`
        }
    });
};
