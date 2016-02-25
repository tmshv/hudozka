export default function(app) {
    app.filter('join', () => {
        return (list, sep=',') =>
            list == null ? '' : list.join(sep);
    });
};
