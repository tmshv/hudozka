export default function(app) {
    app.filter('removeHashtags', () => {
        return string => string.replace(/(#[^\s]+)/g, '');
    });
};
