export default function(app) {
    app.filter('ext', () => {
        return (filname) => {
            let getExt = name => /\.(\w+)$/.exec(name)[1];
            let defaultExt = ext => ext.toUpperCase();

            const exts = ['png', 'pdf', 'jpg', 'jpeg', 'gif', 'doc'];
            const extd = ['ПНГ', 'ПДФ', 'ЖПГ', 'ЖПГ', 'ГИФ', 'ДОК'];

            let ext = getExt(filname);
            const i = exts.indexOf(ext);
            if(i > -1) return extd[i];
            return defaultExt(ext);
        }
    });
};
