export default function(app) {
    app.filter('removeHashtags', () => {
        return string => string ? string.replace(/(#[^\s]+)/g, '') : string;
    });
};
