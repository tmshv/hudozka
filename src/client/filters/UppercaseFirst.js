export default function(app) {
    app.filter('uppercaseFirst', () => {
        return string => string.charAt(0).toUpperCase() + string.slice(1);
    });
};
