export default function (app) {
    app.filter('strip', () => {
        return string => string
            .replace(/^\s+/, '')
            .replace(/\s+$/, '');
    });
};
