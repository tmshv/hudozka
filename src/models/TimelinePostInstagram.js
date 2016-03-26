export default class TimelinePostInstagram {
    constructor(date, image, url, username, userpic, text) {
        this.type = 'instagram';

        this.date = date;
        this.image = image;
        this.url = url;
        this.username = username;
        this.userpic = userpic;
        this.text = text;
    }
}

export function fromInstagram1(post) {
    //var author_id = personByInstagram(team.team, post.data.author);
    //var name = author_id ? team.short(author_id) : post.data.author;

    const name = post.data.author || 'hudozka';
    const userpic = 'https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11357496_464997000344800_2124591831_a.jpg';
    return new TimelinePostInstagram(
        post.date,
        post.data.image.standard_resolution.url,
        post.data.url,
        name,
        userpic,
        post.body
    );
}

export function fromInstagram2(post) {
    const caption = safe(post => post.data.caption.text, '');
    const username = safe(post => post.data.user['username'], '');
    const userpic = safe(post => post.data.user['profile_picture'], '');
    const image = safe(post => post.data.images['standard_resolution'].url, '');

    return new TimelinePostInstagram(
        post.date,
        image(post),
        post.data.link,
        username(post),
        userpic(post),
        caption(post)
    );
}

export const types = {
    'instagram-1': fromInstagram1,
    'instagram-2': fromInstagram2
};

export function createInstance(post) {
    if(post.type in types) {
        let fn = types[post.type];
        
        try{
            return fn(post);           
        }catch(e){
            return null;
        }
    }
    return null;
}

function safe(fn, defaultValue=null){
    return function(){
        try{
            let i = fn.apply(undefined, arguments);
            return i ? i : defaultValue;
        }catch(e){
            return defaultValue
        }
    }
}
