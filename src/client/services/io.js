export default function (app) {
    let socket;

    function init(){
        socket = io();
    }

    app.service('io',  () => {
        if (!socket) init();
        return socket;
    }); 
};
