export default function(app) {
    app.filter('removeNewline', () =>{
        return string => string.replace(/(\n)/g, ' ');
    });
};
