import {instagramToken} from '../config';

const services = {
    instagram: instagramToken
};

export const checkAuth = (name, token) => name in services && services[name] === token; 

