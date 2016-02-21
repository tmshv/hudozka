import template from '../../templates/components/main-menu.html';

export default function (app) {
    app.component('mainMenu', {
        bindings: {
            menu: '=items'
        },
        controller: function(menu){
            this.isActive = item => menu.current ? item.url == menu.current.url : false;
            this.isValid = item => 'url' in item;
        },
        template: template
    });
};